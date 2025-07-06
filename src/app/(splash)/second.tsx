import { Image, StyleSheet, View } from "react-native";

export default function SplashScreenSecond() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={{height: 40, width: 248}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
