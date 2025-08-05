import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavHeader from "../../../components/NavHeader";
import { FONT } from "../../../../assets/constants/fonts";
import { postFeedback } from "@/src/api/connection";
import { getUserIdFromStorage } from "@/src/store/localStorage";
import BottomFormModal from "@/src/components/Modal/BottomFormModal";

export default function SettingsScreen() {
  const [supportModalType, setSupportModalType] = useState<
    "problem" | "feedback" | null
  >(null);

  const [toggles, setToggles] = useState({
    shareVBC: false,
    accessContacts: true,
    accessPhotos: true,
    pendingRequests: true,
    newConnections: true,
    chatNotifications: true,
    allEmails: false,
    acknowledgmentEmails: false,
    reminderEmails: false,
    feedbackEmails: false,
    marketingEmails: false,
  });

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSendFeedback = async (message: string) => {
    const userId = await getUserIdFromStorage();
    const data = {
      message,
      type: supportModalType,
      userId,
    };
    try {
      await postFeedback(data);
      console.log("Feedback sent successfully");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
    setSupportModalType(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 200, flex: 1 }}
    >
      <NavHeader title="Support & Help" />

      <View style={styles.card}>
        <SupportItem
          label="Report a problem"
          onPress={() => setSupportModalType("problem")}
        />
        <Divider />
        <SupportItem
          label="Feedback & Suggestions"
          onPress={() => setSupportModalType("feedback")}
        />
      </View>

      {/* Updated Modal */}
      <BottomFormModal
        visible={!!supportModalType}
        title={
          supportModalType === "problem"
            ? "Report a problem"
            : "Feedback & Suggestions"
        }
        onClose={() => setSupportModalType(null)}
        onSubmit={handleSendFeedback}
      />
    </ScrollView>
  );
}

const SupportItem = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#BBCF8D" />
  </TouchableOpacity>
);

const Divider = () => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: "gray",
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 30,
    backgroundColor: "#3E3E3E",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: FONT.BOLD,
    marginTop: 24,
    marginBottom: 12,
    color: "#FFF",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: FONT.MONSERRATMEDIUM,
    color: "#fff",
  },
});
