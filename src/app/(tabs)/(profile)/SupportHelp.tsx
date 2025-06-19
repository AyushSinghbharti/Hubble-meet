// App.tsx or SettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Platform, Switch, Modal, Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import NavHeader from '../../../components/NavHeader';

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [supportModal, setSupportModal] = useState<'problem' | 'feedback' | null>(null);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <NavHeader title="Support & Help" />

      
       <View style={styles.card}>
    <SupportItem label="Report a problem" onPress={() => setSupportModal('problem')} />
    <SupportItem label="Feedback & Suggestions" onPress={() => setSupportModal('feedback')} />
  </View>

  <Text style={styles.sectionHeader}>My App</Text>
  <View style={styles.card}>
    <SupportItem label="HubbleMeet Demo" onPress={() => {}} />
    <SupportItem label="Contact Us" onPress={() => {}} />
  </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const SettingItem = ({ label, value, onValueChange, subLabel }: any) => (
  <View style={styles.settingItem}>
    <View>
      <Text style={styles.settingLabel}>{label}</Text>
      {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
    </View>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

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
   paddingHorizontal: 16,  // increased from 12
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
  paddingVertical: 16, // increased from 12
  borderBottomWidth: 1,
  borderBottomColor: '#eee', // lighter color (optional)
},

  settingLabel: {
    fontSize: 16,
    color: '#111',
  },
  settingSubLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  button: {
    marginTop:304,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2e2e2e'
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    minHeight: 80,
    marginTop: 10,
    textAlignVertical: 'top'
  },
});
