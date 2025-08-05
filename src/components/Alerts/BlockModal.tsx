import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { FONT } from "@/assets/constants/fonts";
import { useAuthStore } from "@/src/store/auth";

const BlockModal = ({ visible, onClose }) => {
    const userId = useAuthStore((state) => state.userId);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unblockingId, setUnblockingId] = useState(null);

    const fetchBlockedUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "https://d2aks9kyhua4na.cloudfront.net/api/connection/blocked-users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        currentPage: 1,
                        pageSize: 10,
                    }),
                }
            );
            const result = await response.json();
            if (result.success) {
                setBlockedUsers(result.data);
            } else {
                Alert.alert("Error", "Failed to fetch blocked users");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (blockedUserId) => {
        try {
            setUnblockingId(blockedUserId);
            const response = await fetch(
                "https://d2aks9kyhua4na.cloudfront.net/api/connection/unblock",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        blocked_user_id: blockedUserId,
                    }),
                }
            );
            const result = await response.json();
            if (result.success) {
                setBlockedUsers((prev) =>
                    prev.filter((user) => user.user_id !== blockedUserId)
                );
            } else {
                Alert.alert("Error", "Failed to unblock user");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong while unblocking.");
        } finally {
            setUnblockingId(null);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchBlockedUsers();
        }
    }, [visible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.overlay}>

                <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                    <View style={styles.closeCircle}>
                        <MaterialIcons name="close" size={30} color="#000" />
                    </View>
                </TouchableOpacity>
                <View style={styles.modalContainer}>

                    <Text style={styles.title}>Blocked Users</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#CDDC39" style={{ marginTop: 20 }} />
                    ) : (
                        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
                            {blockedUsers.length === 0 ? (
                                <Text style={styles.noUserText}>No blocked users found.</Text>
                            ) : (
                                blockedUsers.map((user, idx) => (
                                    <View key={user.user_id + idx} style={styles.userCard}>
                                        <Image
                                            source={{ uri: user.profile_picture_url }}
                                            style={styles.avatar}
                                        />
                                        <View style={styles.userInfo}>
                                            <Text style={styles.name}>{user.full_name}</Text>
                                            <Text style={styles.dateText}>
                                                On: {user.blocked_date || "--"}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.unblockButton}
                                            onPress={() => handleUnblock(user.user_id)}
                                            disabled={unblockingId === user.user_id}
                                        >
                                            <Text style={styles.unblockText}>
                                                {unblockingId === user.user_id ? "Unblocking..." : "Unblock"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    )}

                    <TouchableOpacity onPress={onClose} style={styles.goBackButton}>
                        <AntDesign name="left" size={18} color="#fff" />
                        <Text style={styles.goBackText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.50)",
    },
    modalContainer: {
        backgroundColor: "#181A1D",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        minHeight: "65%",
        paddingTop: 30,
        paddingHorizontal: 0,
        paddingBottom: 10
    },
    closeIcon: {
        alignSelf: "center",
        marginBottom: 8,
    },
    closeCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#BBCF8D",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 19,
        fontFamily: FONT.BOLD,
        color: "#fff",
        textAlign: "left",
        marginLeft: 20,
        marginBottom: 14,
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#212224",
        paddingVertical: 13,
        paddingHorizontal: 18,
        borderRadius: 22,
        marginBottom: 18,
        marginHorizontal: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 13,
        backgroundColor: "#222"
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontFamily: FONT.BOLD,
        fontSize: 15,
        color: "#fff",
        marginBottom: 3,
    },
    dateText: {
        fontFamily: FONT.REGULAR,
        fontSize: 12,
        color: "#B1B3B4",
    },
    unblockButton: {
        backgroundColor: "#23291B",
        borderColor: "#CDDC39",
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    unblockText: {
        color: "#CDDC39",
        fontSize: 14,
        fontFamily: FONT.BOLD,
    },
    noUserText: {
        color: "#B1B3B4",
        fontFamily: FONT.REGULAR,
        alignSelf: "center",
        marginTop: 32,
    },
    goBackBtn: {
        alignSelf: "center",
        marginTop: 8,
        marginBottom: 5,
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

export default BlockModal;
