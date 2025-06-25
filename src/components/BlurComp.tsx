import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

interface BlurCompProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const ManualBlur: React.FC<BlurCompProps> = ({ children, style }) => {
  return (
    <BlurView
      experimentalBlurMethod="dimezisBlurView"
      tint="systemChromeMaterialDark"
      blurReductionFactor={14}
      intensity={40}
      style={[style, {overflow: "hidden"}]}
    >
      {children}
    </BlurView>
  );
};

export default ManualBlur;
