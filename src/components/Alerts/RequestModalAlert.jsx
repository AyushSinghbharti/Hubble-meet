// MatchModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const MatchModal = ({
  visible,
  onClose,
  onSendMessage,
  user1Image,
  user2Image,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Request accepted</Text>

        <View style={[styles.matchContainer, { zIndex: 1 }]}>
  <>
    {/* Profile Images (zIndex: 2 for front layer) */}
    <Image
  source={typeof user1Image === "string" ? { uri: user1Image } : user1Image}
  style={[
    styles.profileImage,
    { top: 0, left: 30, position: 'absolute', zIndex: 2 },
  ]}
/>
<Image
  source={typeof user2Image === "string" ? { uri: user2Image } : user2Image}
  style={[
    styles.profileImage,
    { bottom: 0, right: 30, position: 'absolute', zIndex: 2 },
  ]}
/>

  </>


  <View style={[styles.line,{left:15,right:-40}]}>
    <View
      style={{
        borderWidth: 1,
        width: 240,
        height: 20,
        position: 'absolute',
        zIndex: 0,
        padding:30,
        top:100,
        transform: [{ rotate: '226deg' , }],
        borderColor:"#C7DA91",
        right:55,
        borderRadius:300

      }}
    />

    {/* Logo in front of line */}
    <Image
      style={{ height: 40, width: 40, zIndex: 1 ,left:-20}}
      source={require('../../../assets/logo/Logo1.png')}
    />
  </View>
</View>


          <TouchableOpacity style={styles.primaryButton} onPress={onSendMessage}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Back to request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MatchModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#556B2F',
    marginBottom: 30,
  },
  matchContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#d0e5b5',
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  face: {
    fontSize: 28,
    textAlign: 'center',
    color: '#A2B969',
  },
  primaryButton: {
    backgroundColor: '#C7DA91',
    padding: 15,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: '#A2B969',
    borderWidth: 2,
    padding: 15,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});
