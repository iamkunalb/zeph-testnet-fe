// DottedPaper.tsx
import React, { PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

type Props = PropsWithChildren<{
  spacing?: number;       // px between dot centers
  size?: number;          // dot diameter
  color?: string;         // dot color
  backgroundColor?: string;
}>;

export default function DottedPaper({
  children,
  spacing = 16,
  size = 2,
  color = "rgba(0,0,0,0.2)",
  backgroundColor = "#fff",
}: Props) {
  const { width, height } = useWindowDimensions();
  const r = size / 2;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <Pattern
            id="dots"
            patternUnits="userSpaceOnUse"
            width={spacing}
            height={spacing}
          >
            <Circle cx={spacing / 2} cy={spacing / 2} r={r} fill={color} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dots)" />
      </Svg>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
