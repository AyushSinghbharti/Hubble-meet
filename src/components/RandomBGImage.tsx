import React, {
  ReactNode,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

interface RandomBGImages {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  type?: "Dark" | "Light" | "SemiDark" | "none";
  blur?: number;
}

// Add ref methods interface
export interface RandomBGImagesRef {
  newImage: () => void;
}

const backgroundImages: ImageSourcePropType[] = [
  require("../../assets/images/backgrounds/bg01.jpg"),
  require("../../assets/images/backgrounds/bg02.jpg"),
  require("../../assets/images/backgrounds/bg03.jpg"),
  require("../../assets/images/backgrounds/bg04.jpg"),
  require("../../assets/images/backgrounds/bg05.jpg"),
  require("../../assets/images/backgrounds/bg06.jpg"),
  require("../../assets/images/backgrounds/bg07.png"),
];

const gradientColour: {
  Dark: [string, string, string, string, string];
  Light: [string, string, string, string, string];
  SemiDark: [string, string, string];
  none: [string, string];
} = {
  Dark: ["transparent", "#00000033", "#00000040", "#000000", "#000000"],
  Light: ["#00000066", "#00000033", "#00000040", "#00000066", "#000000E6"],
  SemiDark: ["#000000CC", "#02020233", "#000000"],
  none: ["transparent", "transparent"],
};

const RandomBackgroundImages = forwardRef<RandomBGImagesRef, RandomBGImages>(
  ({ children, style, type = "Light", blur = 0 }, ref) => {
    const [backgroundImageNumber, setBackgroundImageNumber] = useState(0);

    // Initialize with random image
    useEffect(() => {
      const imageNumber = Math.floor(Math.random() * backgroundImages.length);
      setBackgroundImageNumber(imageNumber);
    }, []);

    // Expose newImage function through ref
    useImperativeHandle(ref, () => ({
      newImage: () => {
        setBackgroundImageNumber(
          (prev) => (prev + 1) % backgroundImages.length
        );
      },
    }));

    return (
      <ImageBackground
        resizeMode="cover"
        source={backgroundImages[backgroundImageNumber]}
        style={CompStyles.container}
        blurRadius={blur}
      >
        <StatusBar style="light" />
        <LinearGradient
          colors={gradientColour[type]}
          style={{ flex: 1, width: "100%" }}
        >
          <LinearGradient colors={gradientColour["SemiDark"]} style={style}>
            {children}
          </LinearGradient>
        </LinearGradient>
      </ImageBackground>
    );
  }
);

const CompStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default RandomBackgroundImages;
