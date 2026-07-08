import type { ReactNode } from "react";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";

type RevealInProps = {
  children: ReactNode;
  /** Stagger index — each step adds ~90ms delay. Pass 0, 1, 2... for a cascade. */
  index?: number;
  className?: string;
};

/**
 * Wraps content in a slow fade-up entrance, matching the deliberate,
 * unhurried motion of Apple-style reveals. Use `index` to stagger a
 * list of cards so they cascade in rather than popping simultaneously.
 */
export function RevealIn({ children, index = 0, className }: RevealInProps) {
  return (
    <Animated.View
      className={className}
      entering={FadeInDown.duration(650)
        .delay(index * 90)
        .easing(Easing.out(Easing.cubic))}
    >
      {children}
    </Animated.View>
  );
}