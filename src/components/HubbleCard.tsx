// CircularUI.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const OUTER_RADIUS = 180;
const INNER_RADIUS = 130;
const IMAGE_SIZE = 60;
const DASH_COUNT = 60;
const DASH_WIDTH = 2;
const DASH_HEIGHT = 10;

const outerImages = [
  require("../../assets/images/p1.jpg"),
  require("../../assets/images/p1.jpg"),
  require("../../assets/images/p1.jpg"),
  require("../../assets/images/p1.jpg"),
  require("../../assets/images/p1.jpg"),
];

const innerImages = [
  require("../../assets/images/p1.jpg"),
  require("../../assets/images/p1.jpg"),
];

const centerImage = require("../../assets/images/p1.jpg");

interface Profile {
  name: string;
  title: string;
  location: string;
  image: any;
}

const CircularUI = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderDashes = (radius: number) => {
    return Array.from({ length: DASH_COUNT }).map((_, index) => {
      const angle = (index / DASH_COUNT) * 2 * Math.PI;
      const x = radius + radius * Math.cos(angle) - DASH_WIDTH / 2;
      const y = radius + radius * Math.sin(angle) - DASH_HEIGHT / 2;
      return (
        <View
          key={`dash-${radius}-${index}`}
          style={[
            styles.dash,
            {
              left: x,
              top: y,
              transform: [{ rotate: `${(angle * 180) / Math.PI}deg` }],
            },
          ]}
        />
      );
    });
  };

  const renderImages = (images: any[], radius: number) => {
    const angleStep = (2 * Math.PI) / images.length;
    return images.map((img, index) => {
      const angle = index * angleStep;
      const x = radius + radius * Math.cos(angle) - IMAGE_SIZE / 2;
      const y = radius + radius * Math.sin(angle) - IMAGE_SIZE / 2;

      return (
        <TouchableOpacity
          key={`img-${radius}-${index}`}
          onPress={() => {
            setSelectedProfile({
              name: "Robin Gupta",
              title: "Design Lead at Amazon",
              location: "Bengaluru, India",
              image: img,
            });
            setModalVisible(true);
          }}
          style={[styles.imageContainer, { top: y, left: x }]}
        >
          <Image source={img} style={styles.image} />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#BBCF8D", "#FFFFFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.circleWrapper}
      >
        <View style={[styles.circle, { width: OUTER_RADIUS * 2, height: OUTER_RADIUS * 2 }]}> 
          {renderDashes(OUTER_RADIUS)}
          {renderImages(outerImages, OUTER_RADIUS)}
        </View>

        <View
          style={[styles.circle, { width: INNER_RADIUS * 2, height: INNER_RADIUS * 2 }]}
        >
          {renderDashes(INNER_RADIUS)}
          {renderImages(innerImages, INNER_RADIUS)}
        </View>

        <View style={styles.centerImageWrapper}>
          <Image source={centerImage} style={styles.centerImage} />
        </View>
      </LinearGradient>

      {selectedProfile && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <ImageBackground
                borderRadius={10}
                source={selectedProfile.image}
                style={styles.modalImage}
              >
                <View style={styles.modalTopIcons}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
                  <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
                </View>

                <View style={styles.profileDetails}>
                  <Text style={styles.name}>{selectedProfile.name}</Text>
                  <Text style={styles.title}>{selectedProfile.title}</Text>
                  <Text style={styles.location}>{selectedProfile.location}</Text>

                  <View style={styles.iconRow}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.iconCircle}>
                      <MaterialCommunityIcons name="share-variant" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.iconCircle}>
                      <Ionicons name="person" size={24} color="#4CAF50" />
                    </View>
                  </View>
                </View>
              </ImageBackground>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Entypo size={24} color={"#fff"} name="cross" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CircularUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrapper: {
    width: OUTER_RADIUS * 2,
    height: OUTER_RADIUS * 2,
    borderRadius: OUTER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
  },
  dash: {
    position: "absolute",
    width: DASH_WIDTH,
    height: DASH_HEIGHT,
    backgroundColor: "#BBCF8D",
    borderRadius: 1,
  },
  imageContainer: {
    position: "absolute",
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: IMAGE_SIZE / 2,
  },
  centerImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  centerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    marginTop: 40,
  },
  modalImage: {
    width: "100%",
    height: "80%",
    borderRadius: 20,
    marginBottom: 15,
  },
  modalTopIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  profileDetails: {
    backgroundColor: "#FFE699",
    marginTop: 370,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEF9C3",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
});