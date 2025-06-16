// App.tsx or SettingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Image */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9' }}
          style={styles.avatar}
        />
      </View>

      {/* Phone Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Phone number</Text>
        <Text style={styles.textInput}>(814) 413-9191</Text>
        <Text style={styles.note}>* You can not edit mobile number</Text>
      </View>

      {/* Email Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Email address</Text>
        <Text style={styles.textInput}>patricia651@outlook.com</Text>
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
            <Ionicons name="trash" size={48} color="#e53935" style={styles.trashIcon} />
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
    width: 96,
    height: 96,
    borderRadius: 48,
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
  textInput: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 6,
    color: '#111',
  },
  note: {
    color: '#888',
    fontSize: 12,
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
