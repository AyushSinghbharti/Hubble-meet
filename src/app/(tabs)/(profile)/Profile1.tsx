// App.tsx or SettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import NavHeader from '../../../components/NavHeader';
import TagInput from '../../../components/TagInput';

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <NavHeader title="Edit Profile" />

      <FormLabel label="User Name *" />
      <Input placeholder="Dennis Callis" />

      <FormLabel label="DOB *" />
      <Input placeholder="20/03/1999" icon name="calendar-outline" />

      <FormLabel label="Phone Number *" />
      <View style={styles.phoneContainer}>
        <View style={styles.countryCode}><Text>🇩🇪 +1</Text></View>
        <View style={{ flex: 1 }}>
          <Input placeholder="525 735 4556" containerStyle={{ marginLeft: 8 }} />
        </View>
      </View>
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Email" />
      <Input placeholder="r.g.rhodes@aol.com" />
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Country/City" />
      <Input placeholder="Jaipur" />

      <FormLabel label="Your Bio" />
      <Input
        placeholder="Write something..."
        multiline
        numberOfLines={4}
        maxLength={100}
        value={bio}
        onChangeText={setBio}
      />
      <Text style={styles.counter}>{bio.length}/100</Text>

      <FormLabel label="Company (Dropdown)" />
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(val) => {
          setValue(val);
          if (val && !companies.includes(val)) setCompanies([...companies, val]);
        }}
        setItems={setItems}
        placeholder="Select or add a company"
        style={{ marginBottom: open ? 160 : 16 }}
      />

      <FormLabel label="Company Tags" />
      <TagInput tags={companies} onChange={setCompanies} />

      <FormLabel label="Job Title" />
      <Input placeholder="General Manager" />

      <FormLabel label="Industries you work in ?" />
      <TagInput tags={industries} onChange={setIndustries} />

      <FormLabel label="Industries Interests" />
      <TagInput tags={interests} onChange={setInterests} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const FormLabel = ({ label }: { label: string }) => (
  <Text style={styles.label}>{label}</Text>
);

const Input = ({ placeholder, icon, multiline = false, numberOfLines = 1, maxLength, value, onChangeText, containerStyle = {} }: any) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      placeholder={placeholder}
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      value={value}
      onChangeText={onChangeText}
    />
    {icon && <Ionicons name={icon} size={20} color="gray" />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 16,
    color: '#111',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#cfd4dc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FBFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InterMedium',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#f1f1f1',
  },
  otpText: {
    color: 'green',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#888',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
