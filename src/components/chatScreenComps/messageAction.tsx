import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const MessageAction = ({
  isVisible = false,
  topOffset = 150,
  leftOffset = 10,
  onAction = (action: string) => {},
}) => {
  if (!isVisible) return null;

  const [viewDelete, setViewDelete] = useState(false);

  const DeleteOptionModal = () => {
    return (
      <TouchableOpacity
        style={{
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
        }}
        onPress={() => {
          setViewDelete(!viewDelete);
        }}
      >
        <View
          style={[
            {
              width: "90%",
              minHeight: 127,
              backgroundColor: "white",
              alignItems: "center",
              // justifyContent: "space-evenly",
              justifyContent: "center",
              gap: 13,
              borderRadius: 20,
            },
          ]}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            hitSlop={15}
            onPress={() => onAction("delete")}
          >
            <Text style={{ fontSize: 16, fontFamily: "Inter" }}>
              Delete For everyone
            </Text>
          </TouchableOpacity>
          <View
            style={{ borderWidth: 0.5, width: "90%", borderColor: "#E3E3E3" }}
          />
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            hitSlop={15}
            onPress={() => onAction("delete")}
          >
            <Text style={{ fontSize: 16, fontFamily: "Inter" }}>
              Delete For me
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (viewDelete) {
    return <DeleteOptionModal />;
  }

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
          source={require("../../../assets/icons/star.png")}
          style={[styles.icon]}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setViewDelete(!viewDelete)}>
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
    backgroundColor: "#fff",
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
    height: 24,
    aspectRatio: 1,
  },
});
