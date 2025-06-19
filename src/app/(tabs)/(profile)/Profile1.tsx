import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import NavHeader from '../../../components/NavHeader';
import SelectCountryModal from '../../../components/selectCountryModal';
import TagDropdown from '../../../components/TagDropdown';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [dob, setDob] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedFlag, setSelectedFlag] = useState({
    flag: 'https://flagcdn.com/w40/us.png',
    dial_code: '+1',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setDob(date);
    hideDatePicker();
  };

  const handleOpenModal = () => {
    const handle = findNodeHandle(flagBoxRef.current);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setFlagBoxPosition({ x: pageX, y: pageY });
        setModalVisible(true);
      });
    }
  };

  const handleSave = () => {
    const formData = {
      name,
      dob: dob ? dob.toISOString().split('T')[0] : '',
      phone,
      email,
      location,
      bio,
      companies,
      jobTitle,
      industries,
      countryCode: selectedFlag.dial_code,
    };

    console.log('Form data:', JSON.stringify(formData, null, 2));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
      <NavHeader title="Profile" />

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/41.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Dennis Callis</Text>
      </View>

      <FormLabel label="User Name *" />
      <Input placeholder="Enter name" value={name} onChangeText={setName} />

      <FormLabel label="DOB *" />
      <TouchableOpacity onPress={showDatePicker}>
        <Input
          placeholder="Select date"
          value={dob ? dob.toLocaleDateString() : ''}
          icon="calendar-clear-outline"
          editable={false}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={dob || new Date(1990, 0, 1)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <FormLabel label="Phone Number *" />
      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countryCode}
          onPress={handleOpenModal}
          ref={flagBoxRef}
        >
          {selectedFlag && (
            <>
              <Image source={{ uri: selectedFlag.flag }} style={{ width: 24, height: 18, marginRight: 6 }} />
              <Text>{selectedFlag.dial_code}</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Input placeholder="525 735 4556" containerStyle={{ marginLeft: 8 }} value={phone} onChangeText={setPhone} />
        </View>
      </View>
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Email" />
      <Input placeholder="r.g.rhodes@aol.com" value={email} onChangeText={setEmail} />
      <Text style={styles.otpText}>Verify with OTP</Text>

      <FormLabel label="Country/City" />
      <Input placeholder="Jaipur" value={location} onChangeText={setLocation} />

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

      <FormLabel label="Company" />
      <TagDropdown
        options={['Google', 'Microsoft', 'Amazon', 'Apple', 'Netflix']}
        selected={companies}
        onChange={setCompanies}
        placeholder="Select companies"
      />

      <FormLabel label="Job Title" />
      <Input placeholder="General Manager" value={jobTitle} onChangeText={setJobTitle} />

      <FormLabel label="Industries" />
      <TagDropdown
        options={['Technology', 'Healthcare', 'Finance', 'Education', 'Retail']}
        selected={industries}
        onChange={setIndustries}
        placeholder="Select industries"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save settings</Text>
      </TouchableOpacity>

      <SelectCountryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(country) => {
          setSelectedFlag({ flag: country.flag, dial_code: country.dial_code });
          setModalVisible(false);
        }}
        position={flagBoxPosition}
      />
    </ScrollView>
  );
}

const FormLabel = ({ label }) => <Text style={styles.label}>{label}</Text>;

const Input = ({
  placeholder,
  icon,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  value,
  onChangeText,
  containerStyle = {},
}) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <TextInput
      style={[styles.input, multiline && styles.textArea, { color: '#000' }]}
      placeholder={placeholder}
      placeholderTextColor="#000"
      multiline={multiline}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      pointerEvents={editable ? 'auto' : 'none'}
    />
    {icon && <Ionicons name={icon} size={20} color="gray" />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 30 : 40,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
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
