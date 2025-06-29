import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";

type ContactCardProps = {
  name: string;
  phone: string;
  photoUri?: string;
};

const ContactCard: React.FC<ContactCardProps> = ({ name, phone, photoUri }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={
            photoUri
              ? { uri: photoUri }
              : require("../assets/default-profile.png") // fallback image
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.phoneRow}>
        <Entypo name="phone" size={20} color="#333" />
        <View style={styles.phoneInfo}>
          <Text style={styles.phoneText}>{phone}</Text>
          <Text style={styles.phoneLabel}>Phone</Text>
        </View>
        <Feather name="check-square" size={22} color="#000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phoneInfo: {
    flex: 1,
    marginLeft: 10,
  },
  phoneText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
  phoneLabel: {
    fontSize: 13,
    color: "#666",
  },
});

export default ContactCard;
