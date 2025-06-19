// App.tsx or SettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Platform, Switch, Modal } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
  <View>
    <NavHeader title="Permissions" />


    <View  style={styles.cardContainer}>
      <Text style={styles.sectionHeader}>Permissions</Text>



    <SettingItem
      label="Allow Matched Users to Share My VBC"
      value={toggles.shareVBC}
      onValueChange={() => toggleSwitch('shareVBC')}
    />
    <SettingItem
      label="Access Contacts from Phone"
      value={toggles.accessContacts}
      onValueChange={() => toggleSwitch('accessContacts')}
      subLabel="Required for sharing contacts in chat"
    />
    <SettingItem
      label="Access Photos from Phone"
      value={toggles.accessPhotos}
      onValueChange={() => toggleSwitch('accessPhotos')}
      subLabel="Required for sharing media in chat"
    />

   

    </View>

    
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
    paddingHorizontal: 16,
    backgroundColor: '#f4f5f7',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  cardContainer: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 16,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 4,
  marginTop: 16,
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
    marginTop: 380,
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    justifyContent:"flex-end",
    

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