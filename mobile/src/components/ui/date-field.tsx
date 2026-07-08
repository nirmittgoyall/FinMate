import { useState } from "react";

import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Modal, Platform } from "react-native";

import { Button } from "@/components/ui/button";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { cn } from "@/lib/utils/cn";
import { Pressable, Text, View } from "@/tw";

type DateFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function DateField({
  label,
  value,
  onChange,
  error,
  hint,
}: DateFieldProps) {
  const parsedDate = parseDateValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(parsedDate);

  const openPicker = () => {
    setDraftDate(parseDateValue(value));
    setIsOpen(true);
  };

  const closePicker = () => setIsOpen(false);

  const commitDate = (nextDate: Date) => {
    onChange(nextDate.toISOString().slice(0, 10));
  };

  const handleChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        closePicker();
        return;
      }

      if (nextDate) {
        commitDate(nextDate);
      }

      closePicker();
      return;
    }

    if (nextDate) {
      setDraftDate(nextDate);
    }
  };

  return (
    <View className="gap-2">
      {label ? <Text className={typography.eyebrow}>{label}</Text> : null}
      <Pressable
        android_ripple={{ color: "rgba(124, 92, 255, 0.12)" }}
        onPress={openPicker}
        className={cn(
          "min-h-14 justify-center rounded-[26px] border bg-app-surface-muted px-4 py-4",
          error ? "border-app-danger" : "border-app-border"
        )}
      >
        <Text className={typography.input}>{dateFormatter.format(parsedDate)}</Text>
      </Pressable>
      {error ? (
        <Text className="text-[13px] leading-[18px] text-app-danger">{error}</Text>
      ) : hint ? (
        <Text className={typography.caption}>{hint}</Text>
      ) : null}

      {Platform.OS === "android" && isOpen ? (
        <DateTimePicker value={parsedDate} mode="date" onChange={handleChange} />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          animationType="slide"
          transparent
          visible={isOpen}
          onRequestClose={closePicker}
        >
          <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: colors.overlay }}>
            <View className="mx-3 mb-3 overflow-hidden rounded-[32px] border border-app-border bg-app-surface px-5 pb-6 pt-4">
              <View className="mb-4 items-center">
                <View className="h-1.5 w-14 rounded-full bg-app-border" />
              </View>
              <View className="mb-4 flex-row items-center justify-between gap-4">
                <View className="gap-1">
                  <Text className={typography.sectionTitle}>Select date</Text>
                  <Text className={typography.caption}>{dateFormatter.format(draftDate)}</Text>
                </View>
              </View>
              <DateTimePicker
                value={draftDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                textColor={colors.text}
                accentColor={colors.primary}
                themeVariant="dark"
              />
              <View className="mt-4 flex-row gap-3">
                <Button className="flex-1" variant="ghost" onPress={closePicker}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onPress={() => {
                    commitDate(draftDate);
                    closePicker();
                  }}
                >
                  Done
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function parseDateValue(value: string) {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}
