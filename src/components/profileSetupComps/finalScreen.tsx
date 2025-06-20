import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const FinalSetupPage: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#9CE89D33",
        marginTop: 40,
      }}
    >
      {/* <SplashScreenSecond /> */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={{ width: 248, height: 40, marginTop: 50, marginBottom: 205 }}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: "InterMediumItalic",
          color: "#000",
          textAlign: "center",
          marginBottom: 21,
        }}
      >
        Your profile is 100% ready.
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontFamily: "InterMediumItalic",
          color: "#596C2D",
          textAlign: "center",
        }}
      >
        Swipe. Flip. Connect
      </Text>
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

export default FinalSetupPage;
