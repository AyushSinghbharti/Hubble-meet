import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";

const screenWidth = Dimensions.get("window").width;

const NotificationCard = ({
  image,
  name,
  status,
  date,
}: {
  image?: string;
  name: string;
  status: string;
  date: string;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: image
                ? image
                : "https://xsgames.co/randomusers/assets/images/favicon.png",
            }}
            style={styles.image}
          />
          <View style={styles.statusDot} />
        </View>

        <View style={styles.textWrapper}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {date}
            </Text>
          </View>

          <Text style={styles.status} numberOfLines={2}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1a1a1a", // Dark background
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageWrapper: {
    marginRight: 12,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  image: {
    height: 48,
    width: 45,
    borderRadius: 24,
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#2ECC71",
    borderWidth: 2,
    borderColor: "#1a1a1a", // Match dark background
  },
  textWrapper: {
    flex: 1,
    flexDirection: "column",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    color: "#ffffff", // Bright text
    flexShrink: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: "#999999",
    flexShrink: 0,
  },
  status: {
    color: "#cccccc",
    fontSize: 14,
    marginTop: 2,
    flexWrap: "wrap",
  },
});
