import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavHeader from "../../../components/NavHeader";
import SupportModal from "../../../components/Modal/SupportModal";
import Button from "../../../components/Button";
import { FONT } from "../../../../assets/constants/fonts";
import { postFeedback } from "@/src/api/connection";
import { getUserIdFromStorage } from "@/src/store/localStorage";

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

  const handleSendFeedback = async(message: string) => {
    const userId = await getUserIdFromStorage();
    console.log(`${supportModalType}: ${message}`);
    const data={
      message,
      type:supportModalType,
      userId: userId, // User ID from the logged in user
    }
    console.log(data);
    try {
      await postFeedback(data);
      console.log("Feedback sent successfully");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
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

      <Text style={styles.sectionHeader}>My App</Text>
      <View style={styles.card}>
        <SupportItem label="HubbleMeet Demo" onPress={() => {}} />
        <Divider />
        <SupportItem label="Contact Us" onPress={() => {}} />
      </View>

      <Button label="Save settings" onPress={() => {}} />

      <SupportModal
        visible={!!supportModalType}
        onClose={() => setSupportModalType(null)}
        onSend={handleSendFeedback}
        type={supportModalType}
      />
    </ScrollView>
  );
}

const SupportItem = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#333" />
  </TouchableOpacity>
);

const Divider = () => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 30,
    backgroundColor: "#3E3E3E",
  },
  card: {
    backgroundColor: "#fff",
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
    fontFamily: FONT.MEDIUM,
    color: "#111",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FONT.SEMIBOLD,
  },
});
