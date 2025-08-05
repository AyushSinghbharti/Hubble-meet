// components/Alerts/ConnectionModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ConnectionRequest } from "@/src/interfaces/connectionInterface";

interface Props {
    visible: boolean;
    profile: ConnectionRequest;
    onAccept: () => void;
    onReject: () => void;
}

const ConnectionModal: React.FC<Props> = ({ visible, profile, onAccept, onReject }) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.card}>
                    <Image source={{ uri: profile.profile_picture_url }} style={styles.image} />
                    <Text style={styles.name}>{profile.full_name}</Text>
                    <Text style={styles.title}>{profile.job_title}</Text>
                    <Text style={styles.bio}>{profile.bio}</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConnectionModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#00000090",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
    },
    title: {
        fontSize: 16,
        color: "#666",
        marginVertical: 4,
    },
    bio: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        marginVertical: 10,
    },
    buttons: {
        flexDirection: "row",
        marginTop: 15,
    },
    rejectBtn: {
        backgroundColor: "#f44336",
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    acceptBtn: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 10,
    },
    rejectText: {
        color: "#fff",
    },
    acceptText: {
        color: "#fff",
    },
});
