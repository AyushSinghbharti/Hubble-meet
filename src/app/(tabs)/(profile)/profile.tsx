import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import InviteModal from "../../../components/Modal/InviteModal";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MyInviteModal from "../../../components/Alerts/MyInviteModal";

// Profile Data
const profileData = {
  name: "Robin Gupta",
  title: "Head of Product at Amazon",
  location: "Bengaluru, India",
  email: "user.work@gmail.com",
  phone: "+91 1234567890",
  about:
    "I am a passionate and detail-oriented Product designer with a strong focus on creating user-centric designs that enhance usability and deliver seamless digital experiences.",
  avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  inviteMessage:
    "Invite friends and peers to join HubbleMeet and grow the community",
};

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [MyInviteModalVisible, setMyInviteModalVisible] = useState(false);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 30 }} />
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("(profile)/Setting")}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileData.avatar }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.subtitle}>{profileData.title}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expand your Hubble Circle</Text>
        <Text style={styles.cardText}>{profileData.inviteMessage}</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.inviteButton}
        >
          <Text style={styles.inviteButtonText}>Invite to Hubblemeet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardText}>{profileData.about}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact</Text>

        <View style={styles.contactRow}>
          <LinearGradient
            colors={["#DCE9BA", "#DCE9BA", "#DCE9BA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Ionicons name="mail-outline" size={20} color="#1F2937" />
          </LinearGradient>

          <View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactEmail}>{profileData.email}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <LinearGradient
            colors={["#DCE9BA", "#DCE9BA", "#DCE9BA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Feather name="phone" size={20} color="#1F2937" />
          </LinearGradient>
          <View>
            <Text style={styles.contactLabel}>Mobile</Text>
            <Text style={styles.contactEmail}>{profileData.phone}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.profileCard]}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: profileData.avatar }}
            style={styles.profileImageSmall}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.subtitle}>{profileData.title}</Text>
            <Text style={styles.location}>{profileData.location}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(pitch)/pitch")}
            style={styles.pitchButton}
          >
            <Image
              style={{ height: 25, width: 25 }}
              source={require("../../../../assets/icons/pitch2.png")}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setMyInviteModalVisible(true)}
          style={styles.shareIcon}
        >
          <Entypo name="share" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <InviteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <MyInviteModal
        visible={MyInviteModalVisible}
        onClose={() => setMyInviteModalVisible(false)}
        profileImage="https://randomuser.me/api/portraits/men/41.jpg"
        name="Robin Gupta"
        qrValue="https://example.com/invite-link"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3E3E3E",
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "InterBold",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#B2CD82",
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "InterBold",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "InterMedium",
    // color: "#3E3E3E",
    color: "#fff",
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: "#7D7D7D",
    fontFamily: "Inter",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "InterBold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Inter",
    marginBottom: 12,
  },
  inviteButton: {
    backgroundColor: "#B2CD82",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "#000",
    fontFamily: "InterBold",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: "#777",
    fontFamily: "SpaceMono",
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: "InterBold",
  },
  iconGradient: {
    width: 35,
    height: 35,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  profileCard: {
    backgroundColor: "#FFE07B",
    padding: 16,
    borderRadius: 16,
    marginBottom: Platform.OS === "ios" ? 20 : 40,
    position: "relative",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImageSmall: {
    width: 120,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
    bottom: 40,
  },
  pitchButton: {
    backgroundColor: "#fff",
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    bottom: 60,
  },
  shareIcon: {
    position: "absolute",
    bottom: 12,
    right: Platform.OS === "ios" ? 193 : 170,
    backgroundColor: "#fff",
    height: 35,
    width: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
