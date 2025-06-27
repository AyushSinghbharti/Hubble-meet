import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

interface TabBarBackgroundProps {
  height?: number;
  bumpWidth?: number;
  bumpHeight?: number;
  fill?: string;
  borderRadius?: number;
}

export default function TabBarBackground({
  height = 200,
  bumpWidth = 90,
  bumpHeight = 25,
  fill = "#fff",
}: TabBarBackgroundProps) {
  const center = width / 2;
  const halfBump = bumpWidth / 2;

  const path = `
    M0 0
    H${center - halfBump}
    C${center - halfBump * 0.6} 0, ${center - halfBump * 0.6} ${-bumpHeight}, ${center} ${-bumpHeight}
    C${center + halfBump * 0.6} ${-bumpHeight}, ${center + halfBump * 0.6} 0, ${center + halfBump} 0
    H${width}
    V${height}
    H0
    Z
  `;

  return (
    <Svg
      width="100%"
      height={height + bumpHeight}
      viewBox={`0 ${-bumpHeight} ${width} ${height + bumpHeight}`}
      style={{
        position: "absolute",
        top: 0,
      }}
    >
      <Path d={path} fill={fill} />
    </Svg>
  );
}
