import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

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
                    <Text style={styles.title}>
                        {type === 'problem' ? 'Report a problem' : 'Feedback & Suggestions'}
                    </Text>

                    <Text style={styles.label}>
                        {type === 'problem'
                            ? 'Feedback & Suggestions'
                            : 'Report a problem'}
                    </Text>

                    <TextInput
                        style={styles.textInput}
                        placeholderTextColor={"#ccc"}
                        placeholder={`Please write your ${type === 'problem' ? 'Please write your problem' : 'Please write your Feedback & Suggestions'}`}
                        multiline
                        maxLength={100}
                        value={message}
                        onChangeText={setMessage}
                    />
                    <Text style={styles.counter}>{message.length}/100</Text>

                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={{ fontSize: 22 }}>✕</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        height: "40%"
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: '#596C2D',
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
        color: '#444',
        right: 70

    },
    textInput: {
        width: '100%',
        minHeight: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
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
        alignItems: 'center',
        width: "100%"
    },
    sendText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
