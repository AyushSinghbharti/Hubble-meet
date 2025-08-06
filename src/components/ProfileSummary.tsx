import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "../interfaces/profileInterface";
import QRNotch from "./ProfileQRBackground";
import { FONT } from "@/assets/constants/fonts";

const { width } = Dimensions.get("window");

const ProfileSummary = ({
  userProfile,
  onBackPress,
  onSuccessPress,
}: {
  userProfile: UserProfile;
  onBackPress: () => void;
  onSuccessPress: () => void;
}) => {
  const {
    full_name,
    city,
    date_of_birth,
    gender,
    current_company,
    job_title,
    bio,
    email,
    phone,
    profile_picture_url,
    industries_of_interest,
    current_industry,
    connection_preferences,
  } = userProfile;

  const formattedDOB = new Date(date_of_birth).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Summary</Text>
          <View style={styles.placeholder} />
        </View>


        <View style={styles.imageContainer}>
          <Image
            source={{ uri: profile_picture_url }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social" size={18} color="#000" />
          </TouchableOpacity>
          {/* QR code in bottom right with curved background that connects to edge */}
          <View style={styles.qrSvgWrapper}>
            <QRNotch
              width={100}
              height={10}
              bumpWidth={100}
              bumpHeight={30}
              fill="#1E1E1E"
            />
            <View style={styles.qrIcon}>
              <Ionicons name="qr-code" size={18} color="#C7F649" />
            </View>
          </View>
        </View>


        <View style={styles.contentSection}>
          <Text style={styles.name}>{full_name}</Text>
          <Text style={styles.location}>{city}</Text>

          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <InfoBox title="Date of Birth" value={formattedDOB} />
              <InfoBox
                title="Gender"
                value={`${gender} ${gender === "Male" ? "♂" : "♀"}`}
              />
            </View>
            <View style={styles.gridRow}>
              <InfoBox
                title="Working at"
                value={current_company?.join(", ") || ""}
              />
              <InfoBox title="Position" value={job_title || ""} />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Bio</Text>
          <Text style={styles.bio}>{bio}</Text>

          <Text style={styles.sectionLabel}>Email</Text>
          <Text style={styles.contact}>{email}</Text>

          <Text style={styles.sectionLabel}>Phone</Text>
          <Text style={styles.contact}>{phone}</Text>

          {/* Tags */}
          <TagSection
            title="Interested Industries"
            tags={industries_of_interest || []}
          />
          <TagSection title="Your Industries" tags={current_industry || []} />
          <TagSection
            title="Connection Preferences"
            tags={connection_preferences || []}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <Ionicons name="chevron-back" size={18} color="#aaa" />
          <Text style={styles.backText}>Back to Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmBtn} onPress={onSuccessPress}>
          <Text style={styles.confirmText}>Confirm</Text>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InfoBox = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoTitle}>{title || ""}</Text>
    <Text style={styles.infoValue}>{value || ""}</Text>
  </View>
);

const TagSection = ({ title, tags }: { title: string; tags: string[] }) => {
  if (!tags?.length) return null;
  return (
    <View style={styles.tagSection}>
      <Text style={styles.sectionLabel}>{title || ""}</Text>
      <View style={styles.tagWrap}>
        {tags.map((tag, i) => (
          <View style={styles.tag} key={i}>
            <Text style={styles.tagText}>{tag || ""}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#000",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontFamily: FONT.MONSERRATBOLD,
    marginLeft: 16,
    flex: 1,
  },
  placeholder: {
    width: 24,
  },
  imageContainer: {
    position: "relative",
    width: width,
    height: 320,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  shareButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#F4E649",
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  contentSection: {
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100, // Add bottom padding for fixed footer
    flex: 1,
  },
  name: {
    color: "#C7F649",
    fontSize: 24,
    fontFamily: FONT.MONSERRATMEDIUM,
  },
  location: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: FONT.MONSERRATMEDIUM,
    paddingBottom: 12,
  },
  gridContainer: {},
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    color: "#8E8E93",
    fontFamily: FONT.MONSERRATMEDIUM,
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: "#FFFFFF",
    fontFamily: FONT.MONSERRATREGULAR,
    fontSize: 15,
    fontWeight: "500",
  },
  sectionLabel: {
    color: "#8E8E93",
    fontFamily: FONT.MONSERRATREGULAR,
    fontSize: 15,
    marginBottom: 8,
    marginTop: 20,
  },
  bio: {
    fontFamily: FONT.MONSERRATMEDIUM,
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  contact: {
    color: "#FFFFFF",
    fontFamily: FONT.MONSERRATMEDIUM,
    fontSize: 15,
    marginBottom: 4,
  },
  tagSection: {
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#C7F649",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 55, // Safe area for home indicator
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backText: {
    color: "#8E8E93",
    fontSize: 16,
  },
  confirmBtn: {
    backgroundColor: "#C7F649",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  confirmText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 16,
  },
  qrWrapper: {
    zIndex: 999,
    position: "absolute",
    bottom: -1,
    right: 10, // centers the curved part horizontally
    width: 70,
    height: 35,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  qrSvgWrapper: {
    position: "absolute",
    bottom: 7,
    right: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  qrIcon: {
    bottom: -12,
    zIndex: 3,
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
