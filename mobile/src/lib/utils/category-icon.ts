import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];

const categoryIconMap: Record<string, IconName> = {
  Food: "restaurant-outline",
  Transport: "car-sport-outline",
  Shopping: "bag-handle-outline",
  Bills: "receipt-outline",
  Health: "heart-outline",
  Education: "school-outline",
  Entertainment: "film-outline",
  Rent: "home-outline",
  Travel: "airplane-outline",
  Salary: "briefcase-outline",
  Freelance: "laptop-outline",
  Business: "storefront-outline",
  Gift: "gift-outline",
  Investment: "trending-up-outline",
  Other: "ellipse-outline",
};

export function getCategoryIcon(category: string): IconName {
  return categoryIconMap[category] ?? "ellipse-outline";
}