import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/constants/colors";

type AmbientGlowProps = {
  /** Size of the glow's bounding box in px. Bigger = softer, more diffuse. */
  size?: number;
  /** Horizontal position as a fraction of parent width (0 = left, 1 = right). */
  x?: number;
  /** Vertical position as a fraction of parent height (0 = top, 1 = bottom). */
  y?: number;
  color?: string;
};

/**
 * A soft, blurred-looking radial light source, meant to sit absolutely
 * positioned behind hero content (balance card, screen headers, sign-in hero).
 * Mimics the volumetric glow from Apple-style product reveals using a plain
 * radial gradient faded to transparent — no blur library required.
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
        opacity: 0.9,
      }}
      pointerEvents="none"
    />
  );
}