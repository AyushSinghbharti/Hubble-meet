import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavHeader from '../../../components/NavHeader';
import SupportModal from '../../../components/Modal/SupportModal';


export default function SettingsScreen() {
  const [supportModalType, setSupportModalType] = useState<'problem' | 'feedback' | null>(null);

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

  const handleSendFeedback = (message: string) => {
    console.log(`${supportModalType}: ${message}`);
    // Here, send message to backend or analytics service
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <NavHeader title="Support & Help" />

      <View style={styles.card}>
        <SupportItem label="Report a problem" onPress={() => setSupportModalType('problem')} />
        <SupportItem label="Feedback & Suggestions" onPress={() => setSupportModalType('feedback')} />
      </View>

      <Text style={styles.sectionHeader}>My App</Text>
      <View style={styles.card}>
        <SupportItem label="HubbleMeet Demo" onPress={() => {}} />
        <SupportItem label="Contact Us" onPress={() => {}} />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
    backgroundColor: '#f4f5f7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#596C2D',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#111',
  },
  button: {
    marginTop: 304,
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
