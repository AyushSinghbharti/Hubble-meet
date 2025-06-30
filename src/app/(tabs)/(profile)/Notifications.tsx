// App.tsx or SettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Platform, Switch, Modal } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import NavHeader from '../../../components/NavHeader';

export default function SettingsScreen() {
  const [bio, setBio] = useState('');
  const [companies, setCompanies] = useState(['Google', 'Amazon']);
  const [industries, setIndustries] = useState(['Tech', 'Finance']);
  const [interests, setInterests] = useState(['Fintech', 'Hospitality']);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Google', value: 'Google' },
    { label: 'Amazon', value: 'Amazon' },
    { label: 'Apple', value: 'Apple' },
    { label: 'Netflix', value: 'Netflix' },
    { label: 'Meta', value: 'Meta' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <NavHeader title="Notifications" style={{paddingHorizontal: 16}}  />


      <View style={{ flex: 1,
  paddingHorizontal: 15,
  backgroundColor: '#fff',
  marginVertical:20,
  marginHorizontal:20,
  borderRadius:20,
 

  paddingTop: 16,}} >

    <Text style={styles.sectionHeader}>Notifications</Text>
      <SettingItem label="New Pending Requests" value={toggles.pendingRequests} onValueChange={() => toggleSwitch('pendingRequests')} />
      <SettingItem label="New Connections Made" value={toggles.newConnections} onValueChange={() => toggleSwitch('newConnections')} />
      <SettingItem label="Chat Notifications" value={toggles.chatNotifications} onValueChange={() => toggleSwitch('chatNotifications')} />
      <SettingItem label="All Email Notifications" value={toggles.allEmails} onValueChange={() => toggleSwitch('allEmails')} />
      <SettingItem label="Acknowledgement Emails" value={toggles.acknowledgmentEmails} onValueChange={() => toggleSwitch('acknowledgmentEmails')} />
      <SettingItem label="Reminder Emails" value={toggles.reminderEmails} onValueChange={() => toggleSwitch('reminderEmails')} />
      <SettingItem label="Feedback Emails" value={toggles.feedbackEmails} onValueChange={() => toggleSwitch('feedbackEmails')} />
      <SettingItem label="News / Marketing Emails" value={toggles.marketingEmails} onValueChange={() => toggleSwitch('marketingEmails')} />


      </View>

      

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save settings</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
        paddingTop: Platform.OS === 'ios' ? 10 : 30,

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
    marginTop:94,
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
    width: '80%',
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
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});