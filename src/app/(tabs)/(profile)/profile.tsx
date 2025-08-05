import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import InviteModal from "../../../components/Modal/InviteModal";
import MyInviteModal from "../../../components/Alerts/MyInviteModal";
import ProfileCard from "../../../components/profileSetupComps/profileCard";
import { useAuthStore } from "@/src/store/auth";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from 'react-native-qrcode-svg';
import Svg, { Path } from "react-native-svg";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [myInviteModalVisible, setMyInviteModalVisible] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const profileData = useAuthStore((state) => state.user);

  console.log("Profile Data User", JSON.stringify(profileData, null, 2));


  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View style={{ width: 30 }} />
        <Text style={[styles.headerText, {marginLeft: 16}]}>Profile Summary</Text>
        <View style={{flexDirection: "row", gap: 8}} >
          <Ionicons name="share-social-outline" size={24} color="#fff" />
          <Ionicons name="settings" size={24} color="#fff" onPress={() => router.push('/Setting')} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.largeImageContainer}>
          <Image
            source={{
              uri: profileData?.profile_picture_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face"
            }}
            style={styles.largeProfileImage}
          />
          <View style={styles.qrCurveContainer}>
            <Svg height={60} width={80} viewBox="0 0 80 60">
              <Path
                d="M0,0 Q40,60 80,0 L80,0 Z"
                fill="#181818" // Match the background of your card
              />
            </Svg>

            <TouchableOpacity
              style={styles.qrButtonLarge}
              onPress={toggleQR}
            >
              <MaterialIcons
                name="qr-code-2"
                size={24}
                color="#B8E986"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileContent}>
          <Text style={styles.modalName}>{profileData?.full_name}</Text>
          <Text style={styles.modalLocation}>{profileData?.city}, India</Text>

          <View style={styles.modalInviteSection}>
            <Text style={styles.modalInviteTitle}>Expand your Hubble Circle</Text>
            <Text style={styles.modalInviteDescription}>
              Invite friends and peers to join HubbleMeet and grow the community
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.modalInviteButton}
            >
              <Text style={styles.modalInviteButtonText}>Invite to Hubblemeet</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <Text style={styles.detailValue}>{profileData?.date_of_birth?.split("T")[0] || "23rd Sep 2001"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{profileData?.gender || "Male ♂"}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Working at</Text>
              <Text style={styles.detailValue}>{profileData?.current_company?.[0] || "Amazon"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Position</Text>
              <Text style={styles.detailValue}>{profileData?.job_title || "Design Lead"}</Text>
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.bioText}>
              {profileData?.bio || "I am a passionate and details oriented Product designer with a strong focus on creating user-centric designs that enhances usability and deliver seamless digital experiences"}
            </Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Email</Text>
            <View style={styles.contactRow}>
              <LinearGradient
                colors={["#DCE9BA", "#DCE9BA", "#DCE9BA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="mail-outline" size={20} color="#1F2937" />
              </LinearGradient>
              <Text style={styles.contactText}>{profileData?.email || "jhondoe254@gmail.com"}</Text>
            </View>
            <Text style={styles.sectionTitle}>Phone</Text>
            <View style={styles.contactRow}>
              <LinearGradient
                colors={["#DCE9BA", "#DCE9BA", "#DCE9BA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Feather name="phone" size={20} color="#1F2937" />
              </LinearGradient>
              <Text style={styles.contactText}>{profileData?.phone || "+91 990 334 4556"}</Text>
            </View>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Your Industries</Text>
            <View style={styles.tagsContainer}>
              {(profileData?.current_industry || ["Computers & Electronics", "Government", "Manufacturing", "Marketing & Advertising"]).map((industry, index) => (
                <View key={index} style={styles.modalTag}>
                  <Text style={styles.modalTagText}>{industry}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Interested Job Roles</Text>
            <View style={styles.tagsContainer}>
              {["Product Designer", "Project Manager", "Design Engineer", "Interaction Designer"].map((role, index) => (
                <View key={index} style={styles.modalTag}>
                  <Text style={styles.modalTagText}>{role}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Interested Industries</Text>
            <View style={styles.tagsContainer}>
              {(profileData?.industries_of_interest || ["Design", "Financial", "Construction", "Agentic AI", "Front-end Developing"]).map((industry, index) => (
                <View key={index} style={styles.modalTag}>
                  <Text style={styles.modalTagText}>{industry}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ height: 50 }} />
        </View>

        {showQR && (
          <View style={styles.qrOverlay}>
            <TouchableOpacity
              style={styles.qrCloseButton}
              onPress={toggleQR}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.qrContainer}>
              <QRCode
                value="https://hubblemeet.com/profile/shyam-kumar"
                size={200}
                color="#000"
                backgroundColor="#fff"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <InviteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <MyInviteModal
        visible={myInviteModalVisible}
        onClose={() => setMyInviteModalVisible(false)}
        profileImage={profileData?.profile_picture_url || "https://via.placeholder.com/100"}
        name={profileData?.full_name || "Harsha"}
        qrValue="https://example.com/invite-link"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#000",
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "InterBold",
  },
  largeImageContainer: {
    position: "relative",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#000",
  },
  largeProfileImage: {
    width: width,
    height: width - 40,
  },
  // qrButtonLarge: {
  //   position: "absolute",
  //   top: 330,
  //   right: 30,
  //   padding: 12,
  //   borderRadius: 20,
  //   backgroundColor: "#1a1a1a"

  // },
  profileContent: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: -20,
  },
  modalName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B8E986",
    textAlign: "left",
    marginBottom: 4,
  },
  modalLocation: {
    fontSize: 16,
    color: "#B8E986",
    textAlign: "left",
    marginBottom: 24,
  },
  modalInviteSection: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalInviteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  modalInviteDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInviteButton: {
    backgroundColor: "#B8E986",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalInviteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  detailsGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    marginRight: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  bioSection: {
    marginTop: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconGradient: {
    width: 35,
    height: 35,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#DCE9BA",
  },
  tagsSection: {
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalTag: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    marginRight: 8,
  },
  modalTagText: {
    fontSize: 14,
    color: "#B8E986",
  },
  qrOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  qrCloseButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1001,
    padding: 10,
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 16,
  },

  qrCurveContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 60,
    zIndex: 10,
  },

  qrButtonLarge: {
    position: "absolute",
    width: "60%",
    top: 352,
    right: 12,
    backgroundColor: "#181818", // or match cardColor
    padding: 8,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

});