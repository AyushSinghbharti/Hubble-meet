import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FONT } from "@/assets/constants/fonts";

interface DeleteAccountModalProps {
    onDelete: () => void;
    triggerText?: string;
    subText?: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    onDelete,
    triggerText = "Delete Account",
    subText = "You will have a 30 days grace period to recover your account",
}) => {
    const [visible, setVisible] = useState(false);

    const handleDelete = () => {
        onDelete();
        setVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.triggerButton}
                onPress={() => setVisible(true)}
            >
                <View style={styles.leftContent}>
                    <Text style={styles.triggerText}>{triggerText}</Text>
                    <Text style={[styles.subText, { fontFamily: FONT.ITALIC }]}>{subText}</Text>
                </View>
                <AntDesign name="right" color={"#DD4646"} size={20} />
            </TouchableOpacity>


            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* Close (X) icon at the top of screen */}
                    <TouchableOpacity
                        onPress={() => setVisible(false)}
                        style={styles.closeIconWrapper}
                    >
                        <Ionicons name="close" size={24} color="#1E1E1E" />
                    </TouchableOpacity>

                    {/* Bottom sheet modal */}
                    <View style={styles.modalSheet}>
                        <Image
                            source={require("../../assets/Delete.png")}
                            style={styles.trashIcon}
                        />

                        <Text style={styles.modalTitle}>
                            Thinking about deleting your account?
                        </Text>
                        <Text style={styles.modalSubText}>
                            {subText}
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                                style={styles.cancelBtn}
                            >
                                <AntDesign name="left" color={"#BBCF8D"} />
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleDelete}
                                style={styles.deleteBtn}
                            >
                                <Image

                                    source={require("../../assets/icons/delete.png")}
                                    style={styles.deleteIcon}
                                />
                                <Text style={styles.deleteText}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    triggerButton: {
        backgroundColor: "#ffe0e0",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    leftContent: {
        flex: 1,
    },

    triggerText: {
        color: "#e53935",
        fontSize: 16,
        fontWeight: "600",
    },

    subText: {
        color: "#e53935",
        fontSize: 12,
        marginTop: 4,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    closeIconWrapper: {
        position: "absolute",
        top: 460,
        right: 170,
        zIndex: 10,
        backgroundColor: "#BBCF8D",
        borderRadius: 20,
        padding: 6,
    },
    modalSheet: {
        backgroundColor: "#1A1A1A",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
        alignItems: "center",
    },
    trashIcon: {
        width: 60,
        height: 60,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        marginBottom: 8,
        fontFamily: FONT.MONSERRATMEDIUM,
    },
    modalSubText: {
        fontSize: 14,
        color: "#ccc",
        textAlign: "center",
        marginBottom: 24,
        fontFamily: FONT.MONSERRATREGULAR,
    },
    modalActions: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    cancelBtn: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        padding: 12,
        marginRight: 8,
        borderRadius: 8,

        justifyContent: "center",
    },
    cancelText: {
        color: "#BBCF8D",
        fontSize: 14,
        marginLeft: 6,
    },
    deleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF5656",
        flex: 1,
        padding: 12,
        marginLeft: 8,
        borderRadius: 18,
        justifyContent: "center",
    },
    deleteIcon: {
        width: 18,
        height: 18,
        marginRight: 6,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});

export default DeleteAccountModal;
