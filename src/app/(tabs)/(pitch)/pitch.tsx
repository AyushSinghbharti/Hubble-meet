import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";
import { useRouter } from "expo-router";

const pitch = {
  id: "1",
  // thumbnail:/
  // "https://images.unsplash.com/photo-1523292562811-33063c2c62b7?auto=format&fit=crop&w=800&q=60",
  thumbnail:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2F9%253A16&psig=AOvVaw292RLKOhdyyYphWZibBzPd&ust=1750270110186000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCIu7OG-Y0DFQAAAAAdAAAAABAE",
  user: {
    name: "Hellen Whilliams",
    avatar: "https://randomuser.me/api/portraits/women/76.jpg",
    tagline: "Lorem ipsum dolor sit amet",
  },
  likes: 1580,
};

const dummyUser = {
  name: "Ashley Joe",
  position: "Head of Product at Amazon",
  location: "Bengaluru, India",
  about:
    "I am a passionate and details oriented Product designer with a strong focus on creating user-centric designs that enhances usability and deliver seamless digital experiences",
  industries: [
    "Computers & Electronics",
    "Government",
    "Manufacturing",
    "Marketing & Advertising",
  ],
  interests: ["UI Design", "Leadership", "Product Strategy", "Research"],
  image:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
};

export default function PitchScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerContainer]}>
        <View></View>
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={{ height: 24, width: 148 }}
        />
        <TouchableOpacity
          onPress={() => router.push("/profileStack/createPitch")}
        >
          <View style={[styles.iconContainer]}>
            <Image
              source={require("../../../../assets/icons/pitch2.png")}
              style={{ height: 24, aspectRatio: 1 }}
            />
            <Text style={[styles.headerText]}>My Pitch</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Cards Container */}
      {flipped ? (
        <MainCardWrapper
          pitch={pitch}
          onPress={() => {
            setFlipped(!flipped);
          }}
        />
      ) : (
        <FlipCardWrapper
          item={dummyUser}
          onPress={() => {
            setFlipped(!flipped);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 32,
  },
  headerContainer: {
    width: "100%",
    // backgroundColor: "red",
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  headerText: {
    fontSize: 10,
    color: "#64748B",
  },
});
