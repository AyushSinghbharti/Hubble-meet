import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AlertModal from "../../../components/Alerts/AlertModal";
import BlockUserModal from "../../../components/Modal/BlockUserModal";
import ShareModal from "../../../components/Share/ShareBottomSheet";
import { useSendConnection } from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";
import { useConnectionStore } from "@/src/store/connectionStore";
import { usePitchStore } from "@/src/store/pitchStore";
import { FONT } from "../../../../assets/constants/fonts";
import styles from "./Styles/Styles";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const screenWidth = Dimensions.get("window").width;

const ProfileCard = ({
    profile,
    onSwipeComplete,
    onRejectSwipe,
    rightSwipeCount,
    persistentSwipeCount,
    isExpanded,
    onToggleDetails,
    setError,
    isProfileCompleted,
    isPromptVisible,
}) => {
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);
    const buttonOpacity = useSharedValue(1);
    const rotationY = useSharedValue(0); // 0 = front, 1 = back

    const [requestSentVisible, setRequestSentVisible] = useState(false);
    const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);
    const [shareAlertVisible, setShareAlertVisible] = useState(false);
    const [blockAlertVisible, setBlockAlertVisible] = useState(false);
    const [thumbImageAlertVisible, setThumbImageAlertVisible] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const recommendations = useConnectionStore((s) => s.recommendations);
    const userId = useAuthStore((state) => state.userId);
    const { mutate: sendConnection } = useSendConnection();
    const route = useRouter();

    useEffect(() => {
        rotationY.value = withTiming(isExpanded ? 1 : 0, { duration: 400 });
    }, [isExpanded]);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
            { perspective: 1000 },
            { rotateY: `${interpolate(rotationY.value, [0, 1], [0, 180])}deg` },
        ],
        opacity: opacity.value,
    }));

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
                    const message =
                        error?.response?.data?.message ?? "Something went wrong";
                    setError(message);
                },
            }
        );
    };

    const handleImageTap = useCallback(() => {
        if (isPromptVisible) return;
        onToggleDetails(profile);
    }, [onToggleDetails, profile, isPromptVisible]);

    const imageTapGesture = Gesture.Tap().onEnd(() => {
        "worklet";
        runOnJS(handleImageTap)();
    });

    const panGesture = Gesture.Pan()
        .enabled(!isPromptVisible && !isExpanded)
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
                runOnJS(onRejectSwipe)(profile);
                translateX.value = withSpring(-width);
                rotate.value = withSpring(-ROTATION_DEGREE);
                opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(onSwipeComplete)(profile.user_id, "left");
                    }
                });
            } else if (swipedRight) {
                if (rightSwipeCount >= MAX_RIGHT_SWIPES) {
                    runOnJS(setRightSwipeAlertVisible)(true);
                    translateX.value = withSpring(0);
                    rotate.value = withSpring(0);
                    return;
                }
                runOnJS(handleSendConnection)();
                runOnJS(setRequestSentVisible)(true);
                translateX.value = withSpring(width);
                rotate.value = withSpring(ROTATION_DEGREE);
                opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(onSwipeComplete)(profile.user_id, "right");
                    }
                });
            } else {
                translateX.value = withSpring(0);
                rotate.value = withSpring(0);
            }
        });

    const handleButtonPress = useCallback(() => {
        buttonOpacity.value = withTiming(0.5, { duration: 100 }, () => {
            buttonOpacity.value = withTiming(1, { duration: 100 });
        });
    }, [buttonOpacity]);

    // Updated Share Button Handler
    const handleShareButtonPress = useCallback(
        (event) => {
            event.stopPropagation(); // Prevent gesture interference
            console.log("Share button pressed for user:", profile?.full_name); // Debug log
            handleButtonPress();
            setShareAlertVisible(true);
            setShowShare(true);
        },
        [handleButtonPress, profile]
    );

    const handleRestartButtonPress = useCallback(
        (event) => {
            event.stopPropagation();
            handleButtonPress();
            setBlockAlertVisible(true);
        },
        [handleButtonPress]
    );

    const handleThumbImagePress = useCallback(
        (event, userId) => {
            event.stopPropagation();
            const { setCurrentPitchUser } = usePitchStore.getState();
            const userProfile = recommendations.find(
                (user) => user.user_id === userId
            );
            if (userProfile) {
                setCurrentPitchUser(userProfile);
                setThumbImageAlertVisible(true);
                route.push({
                    pathname: "/pitch",
                    params: { focusUserId: userId },
                });
            } else {
                console.warn("⚠️ User profile not found for user_id:", userId);
            }
        },
        [recommendations, route]
    );

    return (
        <>
            {/* FRONT CARD */}
            {!isExpanded ? (
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.card, cardStyle]}>
                        <GestureDetector gesture={imageTapGesture}>
                            <Animated.Image
                                source={{ uri: profile.profile_picture_url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </GestureDetector>

                        <TouchableOpacity
                            style={styles.expandThumb}
                            onPress={(e) => handleThumbImagePress(e, profile.user_id)}
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
                            <Text style={styles.name}>{profile.full_name}</Text>
                            <Text style={styles.title}>{profile.job_title || ""}</Text>
                            <Text style={styles.location}>{profile.city || ""}</Text>
                        </LinearGradient>

                        <View style={[styles.bottomActions, { zIndex: 100, top: 50 }]}> {/* Increased zIndex */}
                            <TouchableOpacity
                                onPress={handleShareButtonPress}
                                activeOpacity={0.7}
                                accessibilityLabel={`Share ${profile?.full_name || "user"}'s profile`}
                                accessibilityRole="button"
                                style={{ zIndex: 101 }} // Ensure button is on top
                            >
                                <Animated.View
                                    style={[
                                        styles.actionButton,
                                        { bottom: 20 }, // Adjusted positioning
                                        { opacity: buttonOpacity },
                                    ]}
                                >
                                    <Image
                                        source={require("../../../../assets/icons/share1.png")}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </GestureDetector>
            ) : (
                // DETAILS FLIP CARD
                <Animated.View
                    style={{
                        flex: 1,
                        height,
                        maxHeight: "100%",
                        backgroundColor: "#000",
                        borderRadius: 24,
                        overflow: "hidden",
                        width: screenWidth * 0.9,
                    }}
                >
                    <ScrollView
                        style={{
                            flex: 1,
                            width: "100%",
                        }}
                        contentContainerStyle={[
                            cardStyle,
                            {
                                backgroundColor: "#000",
                                minHeight: height,
                                paddingBottom: 40,
                            },
                        ]}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    >
                        <ImageBackground
                            source={{ uri: profile.profile_picture_url }}
                            style={styles.image}
                        >
                            <GestureDetector gesture={imageTapGesture}>
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        width: "100%",
                                        height: 250,
                                        zIndex: 5,
                                        pointerEvents: "auto",
                                    }}
                                />
                            </GestureDetector>

                            <LinearGradient
                                colors={["#1E1E1E", "#1E1E1E", "#1E1E1E", "#1E1E1E"]}
                                style={{
                                    flex: 1,
                                    minHeight: 500,
                                    paddingHorizontal: 24,
                                    paddingTop: 16,
                                    paddingBottom: 32,
                                    justifyContent: "flex-end",
                                    marginTop: 400,
                                }}
                            >
                                <View style={[styles.bottomActions, { zIndex: 100, top: -370, right: 10 }]}>
                                    <TouchableOpacity
                                        onPress={handleShareButtonPress}
                                        activeOpacity={0.7}
                                        accessibilityLabel={`Share ${profile?.full_name || "user"}'s profile`}
                                        accessibilityRole="button"
                                        style={{ zIndex: 101 }}
                                    >
                                        <Animated.View
                                            style={[
                                                styles.actionButton,
                                                { opacity: buttonOpacity },
                                            ]}
                                        >
                                            <Image
                                                source={require("../../../../assets/icons/share1.png")}
                                                style={{ width: 24, height: 24 }}
                                            />
                                        </Animated.View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ bottom: 10, zIndex: 1 }}>
                                    <Text
                                        style={{
                                            color: "#BBCF8D",
                                            fontFamily: FONT.MONSERRATMEDIUM,
                                            fontSize: 34,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {profile.full_name}
                                    </Text>

                                    <View style={{ flexDirection: "row", columnGap: 20 }}>
                                        <View
                                            style={{
                                                backgroundColor: "#222",
                                                borderRadius: 12,
                                                padding: 10,
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#bbb",
                                                    fontFamily: FONT.MONSERRATMEDIUM,
                                                    fontSize: 18,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                Working at {"\n"} {profile.current_company[0]}
                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                backgroundColor: "#222",
                                                borderRadius: 12,
                                                padding: 10,
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#bbb",
                                                    fontFamily: FONT.MONSERRATREGULAR,
                                                    fontSize: 18,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                Position {"\n"} {profile.job_title}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 12, marginBottom: 16 }}>
                                        <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATREGULAR, fontSize: 16, marginBottom: 2 }}>Bio</Text>
                                        <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATMEDIUM, fontSize: 14 }}>{profile.bio}</Text>
                                    </View>

                                    <View
                                        style={{
                                            backgroundColor: "#111",
                                            borderRadius: 16,
                                            padding: 16,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <View>
                                            <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14, marginBottom: 12 }}>
                                                Email
                                            </Text>
                                            <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14 }}>
                                                Phone
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: "#777", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14 }}>
                                                Connect to view
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 16, marginBottom: 2 }}>Interested Industries</Text>
                                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                            {(profile.current_industry || []).map((industry, index) => (
                                                <View key={index} style={{
                                                    backgroundColor: "#333",
                                                    borderRadius: 12,
                                                    marginRight: 8,
                                                    marginBottom: 6,
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 10
                                                }}>
                                                    <Text style={{ color: "#BBCF8D", fontSize: 13, fontFamily: FONT.MONSERRATMEDIUM }}>{industry}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: 18 }}>
                                        <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 16, marginBottom: 2 }}>Areas of Interest</Text>
                                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                            {(profile.industries_of_interest || []).map((interest, idx) => (
                                                <View key={idx} style={{
                                                    backgroundColor: "#333",
                                                    borderRadius: 12,
                                                    marginRight: 8,
                                                    marginBottom: 6,
                                                    paddingHorizontal: 20,
                                                    paddingVertical: 10
                                                }}>
                                                    <Text style={{ color: "#BBCF8D", fontSize: 13, fontFamily: FONT.MONSERRATMEDIUM }}>{interest}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </ScrollView>
                </Animated.View>
            )}

            {/* Modals & Alerts */}
            <AlertModal
                visible={rightSwipeAlertVisible}
                onClose={() => setRightSwipeAlertVisible(false)}
                imageSource={require("../../../../assets/icons/Vfc/vbcactive.png")}
                label={`Daily right swipe limit reached (${MAX_RIGHT_SWIPES}/${MAX_RIGHT_SWIPES})`}
                buttonText="OK"
                viewButton
                onButtonPress={() => setRightSwipeAlertVisible(false)}
                positionBottom
            />

            <AlertModal
                name={profile.full_name}
                visible={requestSentVisible}
                onClose={() => setRequestSentVisible(false)}
                imageSource={require("../../../../assets/tick.png")}
                label="Request Sent"
                onButtonPress={() => setRequestSentVisible(false)}
                positionTop
            />

            <ShareModal
                visible={shareAlertVisible}
                onClose={() => {
                    setShareAlertVisible(false);
                    setShowShare(false); // Ensure showShare is reset
                }}
                cardProfile={profile}
            />

            <BlockUserModal
                visible={blockAlertVisible}
                onClose={() => setBlockAlertVisible(false)}
                userName={profile?.full_name || "This user"}
                blockedUserId={profile?.user_id}
                onBlockSuccess={() => {
                    translateX.value = withSpring(-width);
                    rotate.value = withSpring(-ROTATION_DEGREE);
                    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                        if (finished) runOnJS(onSwipeComplete)(profile.user_id, "blocked");
                    });
                }}
            />
        </>
    );
};

export default ProfileCard;