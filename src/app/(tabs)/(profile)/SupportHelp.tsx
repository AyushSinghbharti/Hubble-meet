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

      {/* <Text style={styles.sectionHeader}>Permissions</Text>
      <SettingItem label="Allow Matched Users to Share My VBC" value={toggles.shareVBC} onValueChange={() => toggleSwitch('shareVBC')} />
      <SettingItem label="Access Contacts from Phone" value={toggles.accessContacts} onValueChange={() => toggleSwitch('accessContacts')} subLabel="Required for sharing contacts in chat" />
      <SettingItem label="Access Photos from Phone" value={toggles.accessPhotos} onValueChange={() => toggleSwitch('accessPhotos')} subLabel="Required for sharing media in chat" />

      <Text style={styles.sectionHeader}>Notifications</Text>
      <SettingItem label="New Pending Requests" value={toggles.pendingRequests} onValueChange={() => toggleSwitch('pendingRequests')} />
      <SettingItem label="New Connections Made" value={toggles.newConnections} onValueChange={() => toggleSwitch('newConnections')} />
      <SettingItem label="Chat Notifications" value={toggles.chatNotifications} onValueChange={() => toggleSwitch('chatNotifications')} />
      <SettingItem label="All Email Notifications" value={toggles.allEmails} onValueChange={() => toggleSwitch('allEmails')} />
      <SettingItem label="Acknowledgement Emails" value={toggles.acknowledgmentEmails} onValueChange={() => toggleSwitch('acknowledgmentEmails')} />
      <SettingItem label="Reminder Emails" value={toggles.reminderEmails} onValueChange={() => toggleSwitch('reminderEmails')} />
      <SettingItem label="Feedback Emails" value={toggles.feedbackEmails} onValueChange={() => toggleSwitch('feedbackEmails')} />
      <SettingItem label="News / Marketing Emails" value={toggles.marketingEmails} onValueChange={() => toggleSwitch('marketingEmails')} /> */}

      <Text style={styles.sectionHeader}>Support & Help</Text>
      <SupportItem label="Report a problem" onPress={() => setSupportModal('problem')} />
      <SupportItem label="Feedback & Suggestions" onPress={() => setSupportModal('feedback')} />

      <Text style={styles.sectionHeader}>My App</Text>
      <SupportItem label="HubbleMeet Demo" onPress={() => {}} />
      <SupportItem label="Contact Us" onPress={() => {}} />

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Logout account</Text>
      </TouchableOpacity>

      {/* Logout Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.logoutIcon}>❓</Text>
            <Text style={styles.modalTitle}>Do You Want To Log Out?</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Yes, Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Support Modal */}
      <Modal visible={supportModal !== null} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={{ width: '100%', alignItems: 'flex-end' }}>
              <Pressable onPress={() => setSupportModal(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <Text style={styles.modalTitle}>{supportModal === 'problem' ? 'Report a problem' : 'Feedback & Suggestions'}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={`Please write your ${supportModal === 'problem' ? 'problem' : 'Feedback & Suggestions'}`}
              multiline
              maxLength={100}
            />
            <Text style={{ alignSelf: 'flex-end', color: '#666', marginTop: 4 }}>0/100</Text>
            <TouchableOpacity style={styles.button} onPress={() => setSupportModal(null)}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#f4f5f7',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    marginTop: 24,
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
