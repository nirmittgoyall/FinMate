import { useEffect, useRef, useState } from "react";

import { Text } from "@/tw";

type AnimatedNumberProps = {
  value: number;
  formatter: (value: number) => string;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({
  value,
  formatter,
  duration = 300,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const delta = value - startValue;
    const startTime = Date.now();
    let frame = 0;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + delta * eased;

      setDisplayValue(Number(nextValue.toFixed(2)));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      previousValueRef.current = value;
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      previousValueRef.current = value;
    };
  }, [duration, value]);

  return <Text className={className}>{formatter(displayValue)}</Text>;
}
