import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
// import { BlurView, ExperimentalBlurMethod } from "expo-blur";
// import { BlurView } from "@react-native-community/blur";

interface BlurCompProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const ManualBlur: React.FC<BlurCompProps> = ({ children, style }) => {
  return (
    <View
      // <BlurView
      // Expo BlurView Prop
      // experimentalBlurMethod="dimezisBlurView"
      // experimentalBlurMethod={"blur" as ExperimentalBlurMethod}
      // tint="systemChromeMaterialDark"
      // blurReductionFactor={15}
      // intensity={40}

      // Community Blur View Prop
      // blurAmount={5}
      // blurType={"light"}
      // blurRadius={5}
      // downsampleFactor={5}
      style={[
        style,
        {
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          elevation: 0,
        },
      ]}
    >
      {children}
      {/* </BlurView> */}
    </View>
  );
};

export default ManualBlur;
