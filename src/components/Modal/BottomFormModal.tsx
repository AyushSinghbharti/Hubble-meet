// components/BottomFormModal.tsx
import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type BottomFormModalProps = {
    visible: boolean;
    title?: string;
    placeholder?: string;
    maxLength?: number;
    onClose: () => void;
    onSubmit: (value: string) => void;
};

const BottomFormModal: React.FC<BottomFormModalProps> = ({
    visible,
    title = "Report a problem",
    placeholder = "Please write your problem...",
    maxLength = 100,
    onClose,
    onSubmit,
}) => {
    const [inputValue, setInputValue] = useState("");

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Floating X button */}
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#181818" />
                </Pressable>

                {/* Modal Content */}
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={placeholder}
                            placeholderTextColor="#888"
                            multiline
                            maxLength={maxLength}
                            value={inputValue}
                            onChangeText={setInputValue}
                        />
                        <Text style={styles.charCount}>{`${inputValue.length} / ${maxLength}`}</Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <AntDesign name="left" size={18} color="#fff" />
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                onSubmit(inputValue);
                                setInputValue("");
                            }}
                            style={styles.sendButton}
                        >
                            <Text style={styles.sendText}>Send</Text>
                            <AntDesign name="arrowright" size={18} color="#181818" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BottomFormModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    closeButton: {
        position: "absolute",
        top: 540,
        alignSelf: "center",
        zIndex: 10,
        backgroundColor: "#C6E18E",
        padding: 10,
        borderRadius: 50,
    },
    modalContainer: {
        backgroundColor: "#181818",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        width: "100%",
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    inputBox: {
        backgroundColor: "#1f1f1f",
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    textInput: {
        color: "#fff",
        fontSize: 14,
        height: 80,
        textAlignVertical: "top",
    },
    charCount: {
        color: "#aaa",
        fontSize: 12,
        alignSelf: "flex-end",
        marginTop: 6,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    cancelButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    cancelText: {
        color: "#A3CF5A",
        fontSize: 14,
        marginLeft: 6,
    },
    sendButton: {
        backgroundColor: "#C6E18E",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    sendText: {
        color: "#181818",
        fontWeight: "600",
        fontSize: 14,
        marginRight: 6,
    },
});
