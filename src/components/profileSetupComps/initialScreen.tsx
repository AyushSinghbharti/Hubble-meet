import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const InitialScreen: React.FC = ({ onPress }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#9CE89D33" }}>
      {/* <SplashScreenSecond /> */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={{ width: 248, height: 40, marginTop: 50, marginBottom: 125 }}
      />
      <Image
        source={require("../../../assets/images/splash-screen-1.png")}
        style={{ width: 323, height: 344, marginBottom: 40 }}
      />
      <Text
        style={{
          fontFamily: "InterMediumItalic",
          color: "#596C2D",
          textAlign: "center",
        }}
      >
        Tell us about yourself. {"\n"} It will just take few minutes
      </Text>
      <TouchableOpacity style={splashButton} onPress={onPress}>
        <Text style={splashButtonText}>Let's set up your profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const splashButton = {
  position: "absolute",
  bottom: 50,
  backgroundColor: "#000",
  alignSelf: "center",
  width: "90%",
  height: 50,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
};

const splashButtonText = {
  color: "#fff",
  fontFamily: "InterSemiBold",
  fontSize: 16,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InitialScreen;
