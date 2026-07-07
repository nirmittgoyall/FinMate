import type { ReactNode } from "react";

import { ScreenWrapper } from "@/components/ui";

type ScreenShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  return (
    <ScreenWrapper title={title} subtitle={subtitle}>
      {children}
    </ScreenWrapper>
  );
}
