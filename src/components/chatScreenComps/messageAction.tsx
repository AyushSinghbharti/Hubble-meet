// components/messageAction.tsx
import { FONT } from "@/assets/constants/fonts";
import colourPalette from "@/src/theme/darkPaletter";
import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";

interface MessageActionProps {
  isVisible?: boolean;
  topOffset?: number;
  leftOffset?: number;
  isStarred: boolean;
  onAction: (action: string) => void;
}

const MessageAction = ({
  isVisible = false,
  topOffset = 150,
  leftOffset = 10,
  isStarred,
  onAction,
}: MessageActionProps) => {
  const [viewDelete, setViewDelete] = React.useState(false);

  if (!isVisible) return null;

  const DeleteOptionModal = () => (
    <TouchableOpacity
      style={styles.modalOverlay}
      onPress={() => {
        console.log("pressed");
        setViewDelete(false);
      }}
      activeOpacity={1}
    >
      <View style={styles.deleteModal}>
        <TouchableOpacity
          style={styles.deleteOption}
          // hitSlop={15}
          onPress={() => {
            console.log("pressed");
            onAction("deleteforeveryone");
            setViewDelete(false);
          }}
        >
          <Text style={styles.optionText}>Delete For everyone</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.deleteOption}
          // hitSlop={15}
          onPress={() => {
            onAction("deleteforme");
            setViewDelete(false);
          }}
        >
          <Text style={styles.optionText}>Delete For me</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (viewDelete) return <DeleteOptionModal />

  return (
    <View style={[styles.container, { top: topOffset, left: leftOffset }]}>
      <TouchableOpacity onPress={() => onAction("reply")}>
        <Image
          source={require("../../../assets/icons/reply.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onAction("star")}>
        <Image
          source={
            isStarred
              ? require("../../../assets/icons/star2.png")
              : require("../../../assets/icons/star.png")
          }
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setViewDelete(true)}>
        <Image
          source={require("../../../assets/icons/delete.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MessageAction;

const styles = StyleSheet.create({
  container: {
    minWidth: 84,
    minHeight: 185,
    position: "absolute",
    backgroundColor: colourPalette.backgroundSecondary,
    borderRadius: 18,
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 999,
  },
  icon: {
    tintColor: colourPalette.textPrimary,
    height: 24,
    aspectRatio: 1,
  },
  modalOverlay: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#0000004D",
    position: "absolute",
    elevation: 5,
    top: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  deleteModal: {
    width: "90%",
    minHeight: 127,
    backgroundColor: colourPalette.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
    borderRadius: 20,
  },
  deleteOption: {
    backgroundColor: "red",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: colourPalette.textPrimary,
    fontFamily: FONT.MONSERRATMEDIUM,
  },
  divider: {
    borderWidth: 0.5,
    width: "90%",
    borderColor: "#E3E3E3",
  },
});
