import { FONT } from "@/assets/constants/fonts";
import colourPalette from "@/src/theme/darkPaletter";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

interface HeaderPopupMenuProps {
  isVisible: boolean;
  onOptionSelect: (option: string) => void;
  topOffset?: number;
  rightOffset?: number;
}

const HeaderPopupMenu = ({
  isVisible,
  onOptionSelect,
  topOffset = 60,
  rightOffset = 10,
}: HeaderPopupMenuProps) => {
  if (!isVisible) return null;

  const options = [
    "Media, docs and links",
    "View VBC",
    "Starred messages",
    "Clear chat",
  ];

  return (
    <Pressable
      style={styles.modalContainer}
      onPress={() => onOptionSelect("none")}
    >
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
    </Pressable>
  );
};

export default HeaderPopupMenu;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
  container: {
    minHeight: 175,
    minWidth: 220,
    position: "absolute",
    borderRadius: 15,
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 10,
    paddingHorizontal: 6,
    zIndex: 999,
    justifyContent: "space-evenly",
    backgroundColor: colourPalette.backgroundSecondary,
    borderColor: colourPalette.borderColor,
    borderWidth: 2,
  },
  option: {
    paddingLeft: 12,
    paddingVertical: 8,
  },
  text: {
    color: colourPalette.textPrimary,
    fontFamily: FONT.MONSERRATMEDIUM,
    fontSize: 16,
  },
});
