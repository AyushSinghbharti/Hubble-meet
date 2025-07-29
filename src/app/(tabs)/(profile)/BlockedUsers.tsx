import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { FONT } from "../../../../assets/constants/fonts";
import { useAuthStore } from "@/src/store/auth";

const BlockedUsersScreen = () => {
    const userId = useAuthStore((state) => state.userId);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unblockingId, setUnblockingId] = useState(null);
    console.log("Current User ID", userId);

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
            Alert.alert("Error", "Something went wrong!");
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
            Alert.alert("Error", "Something went wrong!");
        } finally {
            setUnblockingId(null);
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Blocked Users</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#444" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {blockedUsers.length === 0 ? (
                        <Text style={styles.noUserText}>No blocked users found.</Text>
                    ) : (
                        blockedUsers.map((user) => (
                            <View key={user.user_id} style={styles.userCard}>
                                <Image
                                    source={{ uri: user.profile_picture_url }}
                                    style={styles.avatar}
                                />
                                <View style={styles.userInfo}>
                                    <Text style={styles.name}>{user.full_name}</Text>
                                    <Text style={styles.job}>{user.job_title}</Text>
                                    <Text style={styles.bio} numberOfLines={2}>
                                        {user.bio}
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
        </SafeAreaView>
    );
};

export default BlockedUsersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#f8f8f8",
        marginTop: 40
    },
    headerText: {
        fontSize: 18,
        fontFamily: FONT.BOLD,
        color: "#111",
    },
    scrollContent: {
        padding: 16,
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontFamily: FONT.BOLD,
        fontSize: 15,
        color: "#111",
    },
    job: {
        fontSize: 13,
        color: "#555",
        fontFamily: FONT.MEDIUM,
    },
    bio: {
        fontSize: 12,
        color: "#777",
        fontFamily: FONT.REGULAR,
    },
    unblockButton: {
        backgroundColor: "#CDDC39",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    unblockText: {
        fontSize: 13,
        fontFamily: FONT.BOLD,
        color: "#000",
    },
    noUserText: {
        fontFamily: FONT.REGULAR,
        color: "#444",
        textAlign: "center",
        marginTop: 30,
    },
});
