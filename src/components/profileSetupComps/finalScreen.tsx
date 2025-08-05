import React from "react";
import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import colourPalette from "../../theme/darkPaletter";
import RandomBackgroundImages from "../RandomBGImage";
import { FONT } from "@/assets/constants/fonts";

const FinalSetupPage: React.FC = ({ name }: { name: string }) => {
  return (
    <RandomBackgroundImages
      type="Light"
      imageNumber={2}
      blur={5}
      style={{
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        paddingTop: 100,
      }}
    >
      <StatusBar barStyle="light-content" />

      {/* Main Content Card */}
      <View style={styles.contentCard}>
        <Image
          source={require("@/assets/icons/successCelebrate.png")}
          style={{ height: 168, width: 202 }}
        />
        <Text style={styles.mainTitle}>You're all set</Text>
        <Text style={styles.userName}>{name || ""}</Text>
        <Text style={styles.subtitle}>Now go Swipe. Flip. Connect.</Text>
      </View>
    </RandomBackgroundImages>
  );
};

const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: "#121212",
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 60,
    alignItems: "center",
    marginHorizontal: 20,
    minWidth: 300,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: FONT.MONSERRATMEDIUM,
    color: "#A3C25B",
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    fontFamily: FONT.MONSERRATITALICMEDIUM,
    color: "#A3C25B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "InterMedium",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
});

export default FinalSetupPage;
