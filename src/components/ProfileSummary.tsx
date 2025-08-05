// components/ProfileSummary.tsx
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

const { width } = Dimensions.get("window");

const ProfileSummary = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Top Header with dark background */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Summary</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Image with share button overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/p1.jpg")} // replace with actual
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social" size={18} color="#000" />
          </TouchableOpacity>
          {/* QR code in bottom right with curved background that connects to edge */}
          <View style={styles.qrWrapper}>
            <View style={styles.qrCurveBackground}>
              <Ionicons name="qr-code" size={24} color="#C7F649" />
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Name and Location */}
          <Text style={styles.name}>Shyam Kumar</Text>
          <Text style={styles.location}>Bangalore, India</Text>

          {/* Info Grid - 2x2 layout */}
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <InfoBox title="Date of Birth" value="23rd Sep 2001" />
              <InfoBox title="Gender" value="Male ♂" />
            </View>
            <View style={styles.gridRow}>
              <InfoBox title="Working at" value="Amazon" />
              <InfoBox title="Position" value="Design Lead" />
            </View>
          </View>

          {/* Bio */}
          <Text style={styles.sectionLabel}>Bio</Text>
          <Text style={styles.bio}>
            I am a passionate and details oriented Product designer with a
            strong focus on creating user-centric designs that enhances
            usability and deliver seamless digital experiences
          </Text>

          {/* Contact */}
          <Text style={styles.sectionLabel}>Email</Text>
          <Text style={styles.contact}>jhondoe254@gmail.com</Text>

          <Text style={styles.sectionLabel}>Phone</Text>
          <Text style={styles.contact}>+91 990 334 4556</Text>

          {/* Tags */}
          <TagSection
            title="Interested Industries"
            tags={[
              "Design",
              "Financial",
              "Construction",
              "Agentic AI",
              "Front-end Developing",
            ]}
          />
          <TagSection
            title="Your Industries"
            tags={[
              "Computers & Electronics",
              "Government",
              "Manufacturing",
              "Marketing & Advertising",
            ]}
          />
          <TagSection
            title="Interested Job Roles"
            tags={[
              "Product Designer",
              "Project Manager",
              "Design Engineer",
              "Interaction Designer",
            ]}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="chevron-back" size={18} color="#aaa" />
          <Text style={styles.backText}>Back to Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmText}>Confirm</Text>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Reusable Info Box
const InfoBox = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// Reusable Tags
const TagSection = ({ title, tags }: { title: string; tags: string[] }) => (
  <View style={styles.tagSection}>
    <Text style={styles.sectionLabel}>{title}</Text>
    <View style={styles.tagWrap}>
      {tags.map((tag, i) => (
        <View style={styles.tag} key={i}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  </View>
);

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
    fontWeight: "600",
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
    fontWeight: "700",
    marginBottom: 4,
  },
  location: {
    color: "#8E8E93",
    fontSize: 15,
    marginBottom: 20,
  },
  gridContainer: {
    marginBottom: 24,
  },
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
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  sectionLabel: {
    color: "#8E8E93",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 20,
  },
  bio: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  contact: {
    color: "#FFFFFF",
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
    backgroundColor: "#1C1C1E",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 34, // Safe area for home indicator
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

  qrCurveBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
});