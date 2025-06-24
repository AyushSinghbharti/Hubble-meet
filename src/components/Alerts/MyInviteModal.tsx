import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';


const MyInviteModal = ({ visible, onClose, profileImage, name, qrValue }) => {
  const safeQrValue = qrValue || "https://default-link.com";

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={{ fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: '#ccc' }]} />
          )}

          <View style={styles.qrContainer}>
            {/* QR Code with safe logo usage */}
            {Platform.OS === 'ios' ? (
              <QRCode
                value={safeQrValue}
                size={200}
                logo={require('../../../assets/logo/Logo1.png')}
                logoSize={40}
                logoBackgroundColor="transparent"
              />
            ) : (
              <QRCode
                value={safeQrValue}
                size={200}
                 logo={require('../../../assets/logo/Logo1.png')}
              />
            )}

            {/* QR border corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.name}>{name || "Unknown User"}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default MyInviteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '55%',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  name: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 10,
  },
  qrContainer: {
    marginTop: 10,
    marginBottom: 20,
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#B2CD82',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
});
