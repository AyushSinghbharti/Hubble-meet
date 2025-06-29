import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface AttachmentSheetProps {
  isVisible: boolean;
  footerHeight: number;
  handlePress?: (label: string) => void;
}

const AttachmentSheet: React.FC<AttachmentSheetProps> = ({
  isVisible,
  footerHeight,
  handlePress,
}) => {
  if (!isVisible) return null;

  const options = [
    { label: "Photo", icon: require("../../../assets/icons/camera.png") },
    { label: "Document", icon: require("../../../assets/icons/document.png") },
    { label: "VBC", icon: require("../../../assets/icons/vbc2.png") },
    { label: "Contact", icon: require("../../../assets/icons/contact.png") },
  ];

  return (
    <View style={[styles.floatingContainer, { bottom: footerHeight + 5 }]}>
      <View style={styles.container}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handlePress?.(item.label)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AttachmentSheet;

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  icon: {
    height: 24,
    aspectRatio: 1,
    tintColor: "#7A7A7A",
  },
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    width: "90%",
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Inter",
    fontSize: 12,
    marginTop: 5,
    color: "#7A7A7A",
  },
});
