import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FONT } from "@/assets/constants/fonts";

type InfoModalProps = {
    visible: boolean;
    title: string;
    content: string;
    onClose: () => void;
};

const InfoModal: React.FC<InfoModalProps> = ({ visible, title, content, onClose }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Close Button outside Modal - Top Right of screen */}
                <Pressable style={styles.closeCircle} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#181818" />
                </Pressable>

                {/* Modal Content at Bottom */}
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>

                    <ScrollView style={styles.contentScroll}>
                        <Text style={styles.contentText}>{content}</Text>
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} style={styles.goBackButton}>
                        <AntDesign name="left" size={18} color="#fff" />
                        <Text style={styles.goBackText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InfoModal;
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    // This puts the X button OUTSIDE the modal at top-right of screen
    closeCircle: {
        position: "absolute",
        top: 200,
        right: 170,
        backgroundColor: "#C6E18E",
        borderRadius: 50,
        padding: 6,
        zIndex: 10,
    },
    modalContainer: {
        backgroundColor: "#202020",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        width: "100%",
        height: "60%",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 12,
        textAlign: "left",
    },
    contentScroll: {
        marginBottom: 16,
    },
    contentText: {
        color: "#CCCCCC",
        fontSize: 14,
        lineHeight: 22,
        fontFamily: FONT.MONSERRATREGULAR
    },
    goBackButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },
    goBackText: {
        color: "#A3CF5A",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 4,
        fontFamily: FONT.MONSERRATREGULAR
    },
});
