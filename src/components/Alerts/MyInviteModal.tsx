import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const MyInviteModal = ({ visible, onClose, profileImage, name, qrValue }) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={{ fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          <Image source={{ uri: profileImage }} style={styles.profileImage} />

          {/* QR Code Container with Green Corners */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={200}
              logoSize={40}
              logo={require("../../../assets/logo/Logo1.png")}
              logoBackgroundColor="transparent"
            />
            {/* Green corner borders */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.name}>{name}</Text>
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
    height:"55%"
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
    marginHorizontal:-15,
    marginVertical:-10
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    padding:30
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
        padding:30
    
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
        padding:30
  },
  bottomRight: {
    bottom: 0,
    right: 0,

    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
        padding:30
  },

});
