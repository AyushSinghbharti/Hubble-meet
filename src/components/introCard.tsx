import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type IntroCardProps = {
  backgroundImage: any; // should be the imported image module, not a string path
  heading: string;
  description: string;
  onNext: () => void;
};

const IntroCard: React.FC<IntroCardProps> = ({
  backgroundImage,
  heading,
  description,
  onNext,
}) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["transparent", "#000000B3", "#000000"]}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.gradientOverlay}>
          <View style={styles.card}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={{flex: 1, justifyContent: "flex-end"}}>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <AntDesign name="right" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default IntroCard;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    elevation: 5,
  },
  card: {
    width: "90%",
    height: 288,
    margin: 20,
    marginBottom: 45,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
  },
  heading: {
    fontSize: 25,
    fontFamily: "InterBold",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#3C3C3C80",
  },
  nextButton: {
    backgroundColor: "#BBCF8D",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginTop: 20,
    padding: 14,
    borderRadius: 50,
  },
});
