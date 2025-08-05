import React from "react";
import Svg, { Path } from "react-native-svg";

interface QRNotchProps {
  width?: number;
  height?: number;
  bumpWidth?: number;
  bumpHeight?: number;
  fill?: string;
}

const QRNotch = ({
  width = 100,
  height = 50,
  bumpWidth = 60,
  bumpHeight = 30,
  //   fill = "#1E1E1E",
  fill = "#FFFFFF",
}: QRNotchProps) => {
  const center = width / 2;
  const halfBump = bumpWidth / 2;

  // Create path similar to TabBarBackground but inverted (bump goes up)
  const path = `
    M0 ${height}
    V0
    H${center - halfBump}
    C${center - halfBump * 0.6} 0, ${
    center - halfBump * 0.6
  } ${-bumpHeight}, ${center} ${-bumpHeight}
    C${center + halfBump * 0.6} ${-bumpHeight}, ${center + halfBump * 0.6} 0, ${
    center + halfBump
  } 0
    H${width}
    V${height}
    Z
  `;

  return (
    <Svg
      width={width}
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
};

export default QRNotch;
