import type { ReactNode } from "react";

import { Card } from "@/components/ui";

type SectionCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card title={title} description={description} className={className}>
      {children}
    </Card>
  );
}
