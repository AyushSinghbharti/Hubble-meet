import { Image, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreenSecond() {
  return (
    <LinearGradient style={styles.container} colors={["#FFFFFF", "#CFFA7C" , "#9CE89D"]}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={{height: 40, width: 248, marginBottom: 130}}
      />
      <Image
        source={require("../../../assets/images/splash-screen-1.png")}
        style={{height: 344, width: 323.32, marginBottom: 57}}
      />
      <Text style={styles.title}>Swipe. Flip. Connect</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#596C2D",
    fontSize: 30,
    fontFamily: "InterItalicBold",
    // fontWeight: "bold",
  },
});
