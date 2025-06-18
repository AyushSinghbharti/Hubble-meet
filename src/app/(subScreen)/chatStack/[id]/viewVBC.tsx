import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import PopUpNotification from "../../../../components/chatScreenComps/popUpNotification";

export default function ViewVBC() {
  const params = useLocalSearchParams();
  const item = JSON.parse(params.item as string);
  console.log(item);
  const router = useRouter();
  const [isCloseFriend, setCloseFriend] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const actions = [
    { id: "share", label: "Share", icon: "share-2" },
    {
      id: "chat",
      label: "Chat",
      icon: "message-square",
      image: require("../../../../../assets/icons/chat2.png"),
    },
    {
      id: "add",
      label: "Add to Hubble circle",
      icon: "star",
      image: require("../../../../../assets/icons/star.png"),
    },
    {
      id: "block",
      label: "Block user",
      icon: "user-x",
      image: require("../../../../../assets/icons/block.png"),
    },
  ];

  const operation = ({ option }: { option: string }) => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 1000000); //Change this
  };

  const ActionRow = ({ item }: { item: (typeof actions)[0] }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.row}
      activeOpacity={0.6}
      //   onPress={() => console.log("Pressed:", item.id)}
      onPress={() => operation({ option: item.id })}
    >
      {item.image ? (
        <Image source={item.image} style={{ height: 22, width: 22 }} />
      ) : (
        <Feather name={item.icon as any} size={21} color="#1e1e1e" />
      )}
      <Text style={styles.rowLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      style={styles.container}
      onRequestClose={() => router.back()}
      animationType="slide"
    >
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={16}
          style={{ paddingVertical: 12 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity hitSlop={8}>
          <Image
            source={{
              uri: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
            }}
            style={{ width: 200, height: 200 }}
          />
        </TouchableOpacity>
      </View>

      <Image source={item.image} style={styles.avatar} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>Accountant, Apple</Text>

      <View style={styles.divider} />

      <View>
        {actions.map((a) => (
          <ActionRow key={a.id} item={a} />
        ))}
      </View>

      {/* Screen Popups */}
      <PopUpNotification
        visible={isVisible}
        onClose={() => {
          setCloseFriend(!isCloseFriend);
          setVisible(!isVisible);
        }}
        name={item.name}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  videoBtn: {
    width: 24,
    height: 24,
  },

  /* Profile */
  avatar: {
    alignSelf: "center",
    width: 174,
    height: 174,
    borderRadius: 174 / 2,
  },
  name: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "InterBold",
  },
  role: {
    textAlign: "center",
    fontFamily: "Inter",
    marginTop: 4,
    fontSize: 13,
    color: "#000",
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: "#F1F1F1",
    marginVertical: 24,
    marginHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  rowLabel: {
    marginLeft: 16,
    fontSize: 15,
    color: "#000",
    fontFamily: "Inter",
  },
});
