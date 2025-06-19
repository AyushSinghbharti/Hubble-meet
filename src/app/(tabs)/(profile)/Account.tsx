import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import NavHeader from '../../../components/NavHeader';
import { FONT } from '../../../../assets/constants/fonts';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // ✅ State for inputs
  const [phoneNumber, setPhoneNumber] = useState('(814) 413-9191');
  const [email, setEmail] = useState('patricia651@outlook.com');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NavHeader title="Account" />

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/41.jpg' }}
          style={styles.avatar}
        />
      </View>

      {/* Phone Section */}
      <View style={styles.card}>

        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          outlineColor="#5C5C65"
          activeOutlineColor="#5C5C65"
          style={styles.paperInput}
                    label={"Phone number"}
          theme={{ roundness: 8 }}

        />
        <Text style={styles.note}>* You can not edit mobile number</Text>
      </View>

      {/* Email Section */}
      <View style={styles.card}>

        <TextInput
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          label={"Email address"}
          outlineColor="#ccc"
          activeOutlineColor="#000"
          style={styles.paperInput}
          theme={{ roundness: 8 }}
         
        />
        <Text style={styles.note}>* You can not edit email address</Text>
      </View>

      {/* Dark Mode */}
      <View style={styles.toggleCard}>
        <Text style={styles.label}>Dark mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* Delete Account */}
      <TouchableOpacity
        onPress={() => setDeleteModalVisible(true)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete account</Text>
        <Ionicons name="chevron-forward" size={20} color="#e53935" />
      </TouchableOpacity>

      {/* Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              style={styles.modalClose}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Image
              style={styles.trashIcon}
              source={require('../../../../assets/icons/Delete1.png')}
            />
            <Text style={styles.modalTitle}>Thinking about deleting your account?</Text>
            <Text style={styles.modalText}>
              Your account will be permanently removed after a 30-day grace period.
            </Text>
            <TouchableOpacity style={styles.modalDeleteButton}>
              <Text style={styles.modalDeleteText}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 146,
    height: 146,
    borderRadius: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  label: {
    color: '#444',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  note: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
    fontFamily:FONT.REGULAR
  },
  paperInput: {
    backgroundColor: '#fff',
    fontSize: 16,
  },
  toggleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  deleteButtonText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  trashIcon: {
    marginBottom: 16,
    height: 40,
    width: 40,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#222',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  modalDeleteButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalDeleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
