import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavHeader from '../../../components/NavHeader';
import { FONT } from '../../../../assets/constants/fonts';
import Button from '../../../components/Button';

export default function SettingsScreen() {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const phoneNumber = '(814) 413-9191';
  const email = 'patricia651@outlook.com';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NavHeader title="Account" />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/81.jpg' }}
          style={styles.avatar}
        />
      </View>

      {/* Phone number (read-only) */}
      <Text style={styles.label}>Phone number</Text>
      <View style={styles.readOnlyInput}>
        <Text style={styles.readOnlyPhone}>{phoneNumber}</Text>
      </View>
      <Text style={styles.note}>* You can not edit mobile number</Text>

      {/* Email address (read-only) */}
      <Text style={[styles.label, { marginTop: 24 }]}>Email address</Text>
      <View style={styles.readOnlyInput}>
        <Text style={styles.readOnlyEmail}>{email}</Text>
      </View>
      <Text style={styles.note}>* You can not edit email address</Text>

      {/* Delete account button */}
      <TouchableOpacity
        onPress={() => setDeleteModalVisible(true)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete account</Text>
        <Ionicons name="chevron-forward" size={20} color="#e53935" />
      </TouchableOpacity>

      {/* Delete confirmation modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDeleteModalVisible(false)}>
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

            <Button label="Delete account" onPress={() => {}} width="80%" />
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3E3E',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    fontFamily: FONT.MEDIUM,
  },
  readOnlyInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  readOnlyPhone: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.5)',
    fontFamily: FONT.ITALICMEDIUM,
  },
  readOnlyEmail: {
    fontSize: 16,
    fontFamily: FONT.SEMIBOLD,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  note: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 6,
    fontFamily: FONT.MEDIUM,
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
    marginTop: 40,
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
});
