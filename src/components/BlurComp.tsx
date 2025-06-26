import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView, ExperimentalBlurMethod } from "expo-blur";

interface BlurCompProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const ManualBlur: React.FC<BlurCompProps> = ({ children, style }) => {
  return (
    <BlurView
      // Expo BlurView Prop
      experimentalBlurMethod="dimezisBlurView"
      // experimentalBlurMethod={"blur" as ExperimentalBlurMethod}
      tint="systemChromeMaterialDark"
      blurReductionFactor={15}
      intensity={40}

      // Community Blur View Prop
      // blurAmount = {5}
      // blurType={'light'}
      // blurRadius= {5}
      // downsampleFactor={5}

      style={[style, { overflow: "hidden" }]}
    >
      {children}
    </BlurView>
  );
};

export default ManualBlur;
