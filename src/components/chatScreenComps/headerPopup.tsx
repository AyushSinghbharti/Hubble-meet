import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HeaderPopupMenu = ({
  isVisible,
  onOptionSelect,
  topOffset = 60,
  rightOffset = 10,
}) => {
  if (!isVisible) return null;

  const options = [
    "Media, docs, and links",
    "View VBC",
    "Starred messages",
    "Clear chat",
  ];

  return (
    <View style={[styles.container, { top: topOffset, right: rightOffset }]}>
      {options.map((label, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onOptionSelect(label)}
          style={styles.option}
        >
          <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HeaderPopupMenu;

const styles = StyleSheet.create({
  container: {
    height: 217,
    width: 278,
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 999,
    justifyContent: "space-evenly",
  },
  option: {
    paddingLeft: 19,
    paddingVertical: 8,
  },
  text: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#111",
  },
});
