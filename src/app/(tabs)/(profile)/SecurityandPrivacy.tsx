import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import BlockModal from "@/src/components/Alerts/BlockModal";
import InfoModal from "@/src/components/Modal/InfoModal";

const loginAlerts = [
  {
    device: "iPhone 15",
    location: "Bangalore, India",
    time: "09:12 AM",
    date: "16/07/2025",
    current: true,
  },
  {
    device: "iPhone 15",
    location: "Ahmedabad, India",
    time: "09:12 AM",
    date: "16/07/2025",
    current: false,
  },
];

const otherPrivacyItems = [
  { label: "Blocked Users" },
  { label: "Terms & Conditions" },
  { label: "Privacy policy" },
  { label: "Data compliance" },
];

export default function PrivacySettings() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const renderModalContent = (label: string | null) => {
    switch (label) {
      case "Blocked Users":
        return (
          <BlockModal
            onClose={() => setSelectedModal(null)}
            visible={!!selectedModal}
          />
        );
      case "Terms & Conditions":
        return (
          <InfoModal
            visible={!!selectedModal}
            title="Terms & Conditions"
            content={`Terms and conditions outline what users can and cannot do with your website, products, and services. They lay out the rules to protect you in case of misuse and enable you to take action if it becomes necessary.
It’s also referred to by other names such as terms of service (ToS) and terms of use (ToU). Even though they have different names, in fact – there is no difference. 
In order to use your website, products, or services, your customers usually must agree to abide by your terms and conditions first.`}
            onClose={() => setSelectedModal(null)}
          />
        );
      case "Privacy policy":
        return (
          <InfoModal
            visible={!!selectedModal}
            title="Privacy Policy"
            content={`A privacy policy explains how your website, products, and services collect, use, and protect user information. It outlines the types of data gathered, why it is collected, and how it is stored or shared, ensuring compliance with privacy laws.
This document is sometimes referred to as a data protection policy or a privacy statement. Its purpose remains the same: to inform users of their rights and how their personal information is handled.
By using your website, products, or services, customers acknowledge and agree to your your privacy policy.`}
            onClose={() => setSelectedModal(null)}
          />
        );
      case "Data compliance":
        return (
          <InfoModal
            visible={!!selectedModal}
            title="Data Compliance"
            content={`Lorem ipsum dolor sit amet. Non officia nisi vel quis pariatur ea dolorem similique 33 nihil tempora sit quia inventore ut soluta sequi a voluptatibus delectus. Aut modi quia ut quia quod vel vero omnis aut quia consequatur!
Qui aliquid fuga id quibusdam autem sit voluptatem quia. Ut velit quis id tempora architecto est quas obcaecati ut quas ratione sed rerum enim et deserunt unde a consequuntur explicabo. Ab impedit architecto non iure perferendis ut rerum rerum.`}
            onClose={() => setSelectedModal(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Login Alerts Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login Alerts</Text>
          <View>
            {loginAlerts.map((item, idx) => (
              <View key={idx} style={styles.alertCard}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={28}
                  color="#E7F7BA"
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceTitle}>{item.device}</Text>
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
                <View style={{ alignItems: "flex-end", minWidth: 120 }}>
                  {item.current && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Text style={styles.currentDevice}>Current Device</Text>
                      <FontAwesome
                        name="circle"
                        size={12}
                        color="#54AE47"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  )}
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <Text style={styles.timeText}>{item.date}</Text>
                  </View>


                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Other Privacy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Other Privacy</Text>
          <View>
            {otherPrivacyItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.privacyItem,
                  idx === otherPrivacyItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => setSelectedModal(item.label)}
                activeOpacity={0.7}
              >
                <Text style={styles.privacyItemText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#B2CD82" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      {renderModalContent(selectedModal)}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    flex: 1,
  },
  card: {
    backgroundColor: "#191C19",
    margin: 16,
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.17,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    color: "#C6E18E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 2,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  deviceTitle: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 1,
  },
  locationText: {
    color: "#A7B88E",
    fontSize: 13,
    fontWeight: "400",
  },
  currentDevice: {
    color: "#B3DF66",
    fontSize: 13,
    fontWeight: "500",
  },
  timeText: {
    color: "#A6A89B",
    fontSize: 13,
    textAlign: "right",
    fontWeight: "400",
  },
  privacyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomColor: "#313A22",
    borderBottomWidth: 1,
    paddingHorizontal: 2,
  },
  privacyItemText: {
    color: "#F3F3EB",
    fontSize: 15,
    fontWeight: "400",
  },
});
