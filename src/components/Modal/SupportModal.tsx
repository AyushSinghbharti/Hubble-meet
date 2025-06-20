import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const SupportModal = ({ visible, onClose, onSend, type }: any) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend(message);
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {type === 'problem' ? 'Report a problem' : 'Feedback & Suggestions'}
          </Text>

          <Text style={styles.label}>
            {type === 'problem'
              ? 'Please describe the problem'
              : 'We value your feedback!'}
          </Text>

          <TextInput
            style={styles.textInput}
            placeholderTextColor="#ccc"
            placeholder={
              type === 'problem'
                ? 'Please write your problem...'
                : 'Please write your feedback & suggestions...'
            }
            multiline
            maxLength={100}
            value={message}
            onChangeText={setMessage}
          />
          <Text style={styles.counter}>{message.length}/100</Text>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SupportModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 1,
  },
  closeText: {
    fontSize: 22,
    color: '#444',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#596C2D',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    color: '#444',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '100%',
    minHeight: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    opacity: 1,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
