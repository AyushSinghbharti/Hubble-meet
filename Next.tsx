import React, { useState, useCallback, useRef, useMemo } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AlertModal from "../../../components/Alerts/AlertModal";
import Header from "../../../components/Search/ConnectHeader";
import logo from "../../../../assets/logo/logo.png";
import { FONT } from "../../../../assets/constants/fonts";
import styles from "./Styles/Styles";
import BlockUserModal from "../../../components/Modal/BlockUserModal";
import ProfilePrompt from "../../../components/Modal/ProfilePromptModal";
import ShareModal from "../../../components/Share/ShareBottomSheet";
import {
    useAcceptConnection,
    useSendConnection,
} from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";
import { UserProfile } from "@/src/interfaces/profileInterface";
import ErrorAlert from "@/src/components/errorAlert";
import { useConnectionStore } from "@/src/store/connectionStore";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.4;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const UNDO_DURATION = 2000;

const ProfileCard = ({
    profile,
    onSwipeComplete,
    rightSwipeCount,
    isExpanded,
    onToggleDetails,
    setError,
    isTopCard,
}) => {
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);
    const buttonOpacity = useSharedValue(1);

    const [requestSentVisible, setRequestSentVisible] = useState(false);
    const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);
    const [shareAlertVisible, setShareAlertVisible] = useState(false);
    const [blockAlertVisible, setBlockAlertVisible] = useState(false);
    const [thumbImageAlertVisible, setThumbImageAlertVisible] = useState(false);

    const route = useRouter();
    const userId = useAuthStore((state) => state.userId);
    const { mutate: sendConnection } = useSendConnection();

    const handleSendConnection = () => {
        if (!userId || !profile?.user_id) {
            console.warn("Missing user or receiver id");
            return;
        }
        sendConnection(
            {
                user_id: userId,
                receiver_id: profile.user_id,
            },
            {
                onSuccess: (res) => console.log(res),
                onError: (error) => {
                    const message = error?.response?.data?.message ?? "Something went wrong";
                    setError(message);
                },
            }
        );
    };

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const showRequestSentModal = useCallback(() => {
        setRequestSentVisible(true);
    }, []);

    const showRightSwipeAlert = useCallback(() => {
        setRightSwipeAlertVisible(true);
    }, []);

    const showShareAlert = useCallback(() => {
        setShareAlertVisible(true);
    }, []);

    const showBlockAlert = useCallback(() => {
        setBlockAlertVisible(true);
    }, []);

    const showThumbImageAlert = useCallback(() => {
        setThumbImageAlertVisible(true);
    }, []);

    const completeSwipe = useCallback(
        (profileId, direction) => {
            onSwipeComplete(profileId, direction);
        },
        [onSwipeComplete]
    );

    const handleButtonPress = useCallback(() => {
        buttonOpacity.value = withTiming(0.5, { duration: 100 }, () => {
            buttonOpacity.value = withTiming(1, { duration: 100 });
        });
    }, [buttonOpacity]);

    const handleShareButtonPress = useCallback(
        (event) => {
            event.stopPropagation();
            handleButtonPress();
            showShareAlert();
        },
        [handleButtonPress, showShareAlert]
    );

    const handleRestartButtonPress = useCallback(
        (event) => {
            event.stopPropagation();
            handleButtonPress();
            showBlockAlert();
        },
        [handleButtonPress, showBlockAlert]
    );

    const handleThumbImagePress = useCallback(
        (event) => {
            event.stopPropagation();
            showThumbImageAlert();
            route.push("/(pitch)/pitch");
        },
        [showThumbImageAlert, route]
    );

    const handleNameTap = useCallback(() => {
        onToggleDetails(profile);
    }, [onToggleDetails, profile]);

    const panGesture = Gesture.Pan()
        .enabled(!isExpanded && isTopCard)
        .activeOffsetX([-10, 10])
        .onUpdate((e) => {
            "worklet";
            translateX.value = e.translationX;
            rotate.value = (e.translationX / width) * ROTATION_DEGREE;
        })
        .onEnd(() => {
            "worklet";
            const swipedLeft = translateX.value < -SWIPE_THRESHOLD;
            const swipedRight = translateX.value > SWIPE_THRESHOLD;

            if (swipedLeft) {
                translateX.value = withSpring(-width);
                rotate.value = withSpring(-ROTATION_DEGREE);
                opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(completeSwipe)(profile.user_id, "left");
                    }
                });
            } else if (swipedRight) {
                if (rightSwipeCount >= MAX_RIGHT_SWIPES) {
                    runOnJS(showRightSwipeAlert)();
                    translateX.value = withSpring(0);
                    rotate.value = withSpring(0);
                    return;
                }
                runOnJS(handleSendConnection)();
                runOnJS(showRequestSentModal)();
                translateX.value = withSpring(width);
                rotate.value = withSpring(ROTATION_DEGREE);
                opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(completeSwipe)(profile.user_id, "right");
                    }
                });
            } else {
                translateX.value = withSpring(0);
                rotate.value = withSpring(0);
            }
        });

    const detailTapGesture = Gesture.Tap().onEnd(() => {
        "worklet";
        runOnJS(handleNameTap)();
    });

    const cardGesture = Gesture.Simultaneous(panGesture);
    const detailGesture = Gesture.Simultaneous(detailTapGesture);

    return (
        <>
            {!isExpanded ? (
                <GestureDetector gesture={cardGesture}>
                    <Animated.View style={[styles.card, cardStyle]}>
                        <Image
                            source={{ uri: profile.profile_picture_url }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.expandThumb}
                            onPress={handleThumbImagePress}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{ uri: profile.profile_picture_url }}
                                style={styles.thumbImage}
                            />
                            <AntDesign
                                name="arrowsalt"
                                size={16}
                                color="#fff"
                                style={styles.expandIcon}
                            />
                        </TouchableOpacity>
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
                            style={styles.gradient}
                        >
                            <TouchableOpacity onPress={handleNameTap} activeOpacity={0.8}>
                                <Text style={styles.name}>{profile.full_name}</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>{profile.job_title || ""}</Text>
                            <Text style={styles.location}>{profile.city || ""}</Text>
                        </LinearGradient>
                        <View style={styles.bottomActions}>
                            <TouchableOpacity
                                onPress={handleShareButtonPress}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={[styles.actionButton, buttonStyle]}>
                                    <Image
                                        source={require("../../../../assets/icons/share1.png")}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleRestartButtonPress}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={[styles.actionButton, buttonStyle]}>
                                    <Image
                                        source={require("../../../../assets/icons/block2.png")}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </GestureDetector>
            ) : (
                <GestureDetector gesture={detailGesture}>
                    <Animated.View style={[styles.detailContent]}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={styles.backCardScroll}
                            contentContainerStyle={[styles.card, cardStyle]}
                        >
                            <ImageBackground
                                source={{ uri: profile.profile_picture_url }}
                                style={styles.backCardContent}
                                resizeMode="cover"
                            >
                                <LinearGradient
                                    colors={[
                                        "rgba(255, 255, 255, 0.03)",
                                        "#fff",
                                        "#fff",
                                        "#fff",
                                        "#fff",
                                    ]}
                                    style={styles.gradientOverlay}
                                >
                                    <View style={styles.detailContent}>
                                        <TouchableOpacity onPress={handleNameTap} activeOpacity={0.8}>
                                            <Text
                                                style={[
                                                    styles.name,
                                                    { color: "#000", fontFamily: FONT.BOLD },
                                                ]}
                                            >
                                                {profile.full_name}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text
                                            style={[
                                                styles.title,
                                                { color: "#000", fontFamily: FONT.SEMIBOLD },
                                            ]}
                                        >
                                            {profile.job_title}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.location,
                                                { color: "#000", fontFamily: FONT.BOLD },
                                            ]}
                                        >
                                            {profile.city}
                                        </Text>
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>About</Text>
                                            <Text
                                                style={[styles.backText, { fontFamily: FONT.MEDIUM }]}
                                            >
                                                {profile.bio}
                                            </Text>
                                        </View>
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Industries</Text>
                                            <View style={styles.tagsContainer}>
                                                {(profile.current_industry || []).map(
                                                    (industry, index) => (
                                                        <View key={index} style={styles.tagBox}>
                                                            <Text style={styles.tagText}>{industry}</Text>
                                                        </View>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Areas of Interest</Text>
                                            <View style={styles.tagsContainer}>
                                                {profile.industries_of_interest?.map(
                                                    (interest, index) => (
                                                        <View key={index} style={styles.tagBox}>
                                                            <Text style={styles.tagText}>{interest}</Text>
                                                        </View>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </ScrollView>
                    </Animated.View>
                </GestureDetector>
            )}
            <AlertModal
                visible={rightSwipeAlertVisible}
                onClose={() => setRightSwipeAlertVisible(false)}
                imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
                label="Daily right swipe limit reached (10/10)"
                buttonText="OK"
                viewButton
                onButtonPress={() => setRightSwipeAlertVisible(false)}
                positionBottom
            />
            <AlertModal
                visible={requestSentVisible}
                onClose={() => setRequestSentVisible(false)}
                imageSource={require("../../../../assets/icons/tick1.png")}
                label="Request Sent"
                onButtonPress={() => setRequestSentVisible(false)}
                positionTop
            />
            <ShareModal
                visible={shareAlertVisible}
                onClose={() => setShareAlertVisible(false)}
            />
            <BlockUserModal
                visible={blockAlertVisible}
                onClose={() => setBlockAlertVisible(false)}
                onSubmit={() => setBlockAlertVisible(false)}
                label="Profile Blocked"
                buttonText="OK"
                userName={profile?.full_name || "This user"}
            />
        </>
    );
};

const Connect = () => {
    const [swipedIds, setSwipedIds] = useState([]);
    const [rightSwipeCount, setRightSwipeCount] = useState(0);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [expandedProfileId, setExpandedProfileId] = useState(null);
    const [error, setError] = useState(null);
    const [lastRejectedProfileId, setLastRejectedProfileId] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const undoTimeoutRef = useRef(null);

    const recommendations = useConnectionStore((state) => state.recommendations);
    const router = useRouter();

    const handleSwipeComplete = useCallback(
        (user_id, direction) => {
            console.log(`Swipe complete: ${user_id}, Direction: ${direction}`); // Debug log
            if (direction === "left") {
                setLastRejectedProfileId(user_id);
                setShowUndo(true);

                // Immediately update swipedIds to show next card
                setSwipedIds((prev) => {
                    const updated = [...prev, user_id];
                    if (updated.length >= 5 && !showLimitModal) {
                        setShowLimitModal(true);
                    }
                    return updated;
                });

                // Clear existing timeout
                if (undoTimeoutRef.current) {
                    clearTimeout(undoTimeoutRef.current);
                }

                // Set timeout to clear undo
                undoTimeoutRef.current = setTimeout(() => {
                    console.log("Undo timeout expired"); // Debug log
                    setShowUndo(false);
                    setLastRejectedProfileId(null);
                }, UNDO_DURATION);
            } else {
                setSwipedIds((prev) => {
                    const updated = [...prev, user_id];
                    if (updated.length >= 5 && !showLimitModal) {
                        setShowLimitModal(true);
                    }
                    return updated;
                });
                setRightSwipeCount((prev) => prev + 1);
                setExpandedProfileId(null);
            }
        },
        [showLimitModal]
    );

    const handleUndoComplete = useCallback(() => {
        console.log("Undo triggered for profile:", lastRejectedProfileId); // Debug log
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
            undoTimeoutRef.current = null;
        }
        setSwipedIds((prev) => prev.filter((id) => id !== lastRejectedProfileId));
        setShowUndo(false);
        setLastRejectedProfileId(null);
        setExpandedProfileId(null);
    }, [lastRejectedProfileId]);

    const handleToggleDetails = useCallback((profile) => {
        const profileId = profile.user_id;
        setExpandedProfileId((prev) => (prev === profileId ? null : profileId));
    }, []);

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <ProfileCard
                    profile={item}
                    onSwipeComplete={handleSwipeComplete}
                    rightSwipeCount={rightSwipeCount}
                    isExpanded={expandedProfileId === item.user_id}
                    onToggleDetails={handleToggleDetails}
                    setError={setError}
                    isTopCard={index === 0}
                />
            );
        },
        [rightSwipeCount, handleSwipeComplete, expandedProfileId]
    );

    const visibleProfileData = useMemo(() => {
        if (!recommendations?.length) return [];

        if (expandedProfileId) {
            return recommendations.filter((item) => item.user_id === expandedProfileId);
        }

        return recommendations.filter((item) => !swipedIds.includes(item.user_id));
    }, [recommendations, expandedProfileId, swipedIds]);

    return (
        <View style={styles.container}>
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
            <Header
                logoSource={logo}
                onSearch={(text) => console.log("Search:", text)}
            />
            <FlatList
                data={visibleProfileData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.user_id}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            You have no profiles left to connect with!
                        </Text>
                    </View>
                }
            />
            {showUndo && (
                <AlertModal
                    visible={true}
                    onClose={handleUndoComplete}
                    imageSource={require("../../../../assets/icons/cross.png")}
                    label="Profile Rejected"
                    buttonText="Undo"
                    viewButton
                    onButtonPress={handleUndoComplete}
                    positionTop
                />
            )}
            <ProfilePrompt
                visible={showLimitModal}
                onCancel={() => setShowLimitModal(false)}
                onProceed={() => {
                    router.push("/Profile1");
                    setShowLimitModal(false);
                }}
            />
        </View>
    );
};

export default Connect;