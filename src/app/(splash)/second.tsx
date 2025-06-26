import { Image, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export default function SplashScreenSecond() {
  const [themeCode, setThemeCode] = useState<"dark" | "light">("dark");

  const theme = {
    dark: {
      logo: require("../../../assets/logo/logo2.png"),
      image: require("../../../assets/images/splash-screen-2.png"),
      colors1: ["#FFFFFF66", "#999999CC"],
      colors2: ["#000000E6", "#00000033", "#000000E6"],
      textColor: "#FFF",
      height: 362,
      width: 348,
    },
    light: {
      logo: require("../../../assets/logo/logo.png"),
      image: require("../../../assets/images/splash-screen-1.png"),
      colors1: ["#FFFFFF", "#CFFA7C", "#9CE89D"],
      colors2: ["transparent", "transparent"],
      textColor: "#596C2D",
      height: 344,
      width: 323,
    },
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={theme[themeCode].colors1}>
      <StatusBar style={themeCode === "dark" ? "light" : "dark"} />
      <LinearGradient
        style={styles.container}
        colors={theme[themeCode].colors2}
      >
        <Image
          source={theme[themeCode].logo}
          style={{ height: 40, width: 248, marginBottom: 115 }}
        />
        <Image
          source={require("../../../assets/images/splash-screen-2.png")}
          style={{
            height: theme[themeCode].height,
            width: theme[themeCode].width,
            marginBottom: 57,
          }}
        />
        <Text style={[styles.title, { color: theme[themeCode].textColor }]}>
          Swipe. Flip. Connect
        </Text>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 65,
    alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    color: "#596C2D",
    paddingTop: 65,
    fontSize: 30,
    fontFamily: "InterItalicBold",
    // fontWeight: "bold",
  },
});
