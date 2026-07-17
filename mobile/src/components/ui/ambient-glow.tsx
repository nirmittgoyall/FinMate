import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/constants/colors";

type AmbientGlowProps = {
  size?: number;
  x?: number;
  y?: number;
  color?: string;
};

/**
 * A very soft warm halo behind hero content. On the light theme this should
 * read as barely-there depth, not a visible glowing shape — keep opacity low.
 */
export function AmbientGlow({
  size = 420,
  x = 0.5,
  y = 0,
  color = colors.glowCore,
}: AmbientGlowProps) {
  return (
    <LinearGradient
      colors={[color, colors.glowEdge]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      pointerEvents="none"
    />
  );
}