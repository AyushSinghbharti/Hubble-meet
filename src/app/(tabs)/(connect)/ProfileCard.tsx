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
import { BlurView } from "expo-blur";
import Divider from "@/src/components/Divider";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;
const screenWidth = Dimensions.get("window").width;

const ProfileCard = ({
    profile = {},
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
    const rotationY = useSharedValue(0);

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
        onToggleDetails?.(profile);
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
                runOnJS(onRejectSwipe)?.(profile);
                translateX.value = withSpring(-width);
                rotate.value = withSpring(-ROTATION_DEGREE);
                opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                    if (finished) {
                        runOnJS(onSwipeComplete)?.(profile.user_id, "left");
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
                        runOnJS(onSwipeComplete)?.(profile.user_id, "right");
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

    const handleShareButtonPress = useCallback(
        (event) => {
            event.stopPropagation();
            handleButtonPress();
            setShareAlertVisible(true);
            setShowShare(true);
        },
        [handleButtonPress]
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
            const userProfile = recommendations?.find(
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

    const { width: screenWidth } = Dimensions.get("window");
    const CARD_BG = "#000";
    const HIGHLIGHT = "#BBCF8D";
    const SECONDARY_BG = "#222";
    const CHIP_BG = "#333";
    // Defensive: avoid crash if profile is undefined
    const fullName = profile?.full_name ?? "";
    const profilePicture = profile?.profile_picture_url ?? "";
    const jobTitle = profile?.job_title ?? "";
    const location = profile?.city ?? "";
    const bio = profile?.bio ?? "";
    const email = profile?.email ?? "";
    const phone = profile?.phone ?? "";
    const currentCompanyArray = Array.isArray(profile?.current_company)
        ? profile.current_company
        : [];
    const industries = Array.isArray(profile?.current_industry)
        ? profile.current_industry
        : [];
    const interests = Array.isArray(profile?.industries_of_interest)
        ? profile.industries_of_interest
        : [];

    return (
        <>
            {!isExpanded ? (
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.card, cardStyle]}>
                        <GestureDetector gesture={imageTapGesture}>
                            <Animated.Image
                                source={{ uri: profilePicture }}
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
                                source={{ uri: profilePicture }}
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
                            <Text style={styles.name}>{fullName}</Text>
                            <Text style={styles.title}>{jobTitle}</Text>
                            <Text style={styles.location}>{location}</Text>
                        </LinearGradient>

                        <View style={[styles.bottomActions, { zIndex: 100, top: 50 }]}>
                            <TouchableOpacity
                                onPress={handleShareButtonPress}
                                activeOpacity={0.7}
                                accessibilityLabel={`Share ${fullName || "user"}'s profile`}
                                accessibilityRole="button"
                                style={{ zIndex: 101 }}
                            >
                                <Animated.View
                                    style={[
                                        styles.actionButton,
                                        { bottom: 20 },
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
                <View
                    style={{
                        flex: 1,
                        backgroundColor: CARD_BG,
                        overflow: "hidden",
                        width: screenWidth * 1,
                        alignSelf: "center",
                        marginTop: 24,
                        maxHeight: "100%",
                    }}
                >
                    <ScrollView
                        contentContainerStyle={{
                            ...cardStyle,
                            backgroundColor: CARD_BG,
                            minHeight: 800,
                            paddingBottom: 40,

                        }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                    >
                        <ImageBackground
                            source={{ uri: profilePicture }}
                            style={{ height: 370, width: "100%" }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    zIndex: 20,
                                    flexDirection: "row",
                                    gap: 8,
                                    backgroundColor: "#BBCF8D",
                                    padding: 12,
                                    borderRadius: 25



                                }}
                            >
                                <TouchableOpacity onPress={handleShareButtonPress} activeOpacity={0.7} accessibilityRole="button">
                                    <Image
                                        source={require("../../../../assets/icons/share1.png")}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <GestureDetector gesture={imageTapGesture}>
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        width: "100%",
                                        height: 270,
                                        zIndex: 5,
                                    }}
                                />
                            </GestureDetector>
                        </ImageBackground>

                        <LinearGradient
                            colors={["#1E1E1E", "#1E1E1E"]}
                            style={{ paddingHorizontal: 10, paddingTop: 12, paddingBottom: 32 }}
                        >
                            <Text style={{
                                color: HIGHLIGHT,
                                fontFamily: FONT.MONSERRATMEDIUM,
                                fontSize: 34,
                                marginBottom: 10,
                                marginTop: 12,
                            }}>
                                {fullName}
                            </Text>

                            <View style={{ flexDirection: "row", columnGap: 20, marginBottom: 16 }}>
                                <View style={{
                                    backgroundColor: SECONDARY_BG,
                                    borderRadius: 12,
                                    padding: 12,
                                    flex: 1,
                                }}>
                                    <Text style={{
                                        color: "#bbb",
                                        fontFamily: FONT.MONSERRATREGULAR,
                                        fontSize: 15,
                                    }}>
                                        Working at{"\n"}
                                        <Text style={{ color: "#fff" }}>{currentCompanyArray[0]}</Text>
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: SECONDARY_BG,
                                    borderRadius: 12,
                                    padding: 12,
                                    flex: 1,
                                }}>
                                    <Text style={{
                                        color: "#bbb",
                                        fontFamily: FONT.MONSERRATREGULAR,
                                        fontSize: 15,
                                    }}>
                                        Position{"\n"}
                                        <Text style={{ color: "#fff" }}>{jobTitle}</Text>
                                    </Text>
                                </View>
                            </View>

                            {/* Bio section */}
                            <View style={{ marginBottom: 22 }}>
                                <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATREGULAR, fontSize: 16, marginBottom: 2 }}>
                                    Bio
                                </Text>
                                <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATMEDIUM, fontSize: 14 }}>
                                    {bio}
                                </Text>
                            </View>

                            <LinearGradient
                                colors={["#1E1E1E", "#121212"]}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={{
                                    borderRadius: 16,
                                    padding: 16,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: 20,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14, marginBottom: 12 }}>
                                        Email
                                    </Text>
                                    <BlurView intensity={200} tint="dark" style={{ borderRadius: 8, marginBottom: 12, padding: 6 }}>
                                        <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14 }}>{email}</Text>
                                    </BlurView>
                                    <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14 }}>
                                        Phone
                                    </Text>
                                    <BlurView intensity={200} tint="dark" style={{ borderRadius: 5, padding: 4 }}>
                                        <Text style={{ color: "#fff", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14 }}>{phone}</Text>
                                    </BlurView>
                                </View>

                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={{ color: "#777", fontFamily: FONT.MONSERRATSEMIBOLD, fontSize: 14, marginTop: 2 }}>
                                        Connect to view
                                    </Text>
                                </View>
                            </LinearGradient>

                            <Divider width="120%" align="center" zIndex={10} />


                            {/* Interested Industries */}
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{
                                    color: "#fff",
                                    fontFamily: FONT.MONSERRATSEMIBOLD,
                                    fontSize: 16,
                                    marginBottom: 6
                                }}>
                                    Interested Industries
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    {industries.map((industry, idx) => (
                                        <View
                                            key={idx}
                                            style={{
                                                backgroundColor: CHIP_BG,
                                                borderRadius: 12,
                                                marginRight: 8,
                                                marginBottom: 8,
                                                paddingHorizontal: 18,
                                                paddingVertical: 9,
                                            }}>
                                            <Text style={{ color: HIGHLIGHT, fontSize: 14, fontFamily: FONT.MONSERRATMEDIUM }}>{industry}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>


                            <Divider width="120%" align="center" zIndex={10} />
                            {/* Your Industries */}
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{
                                    color: "#fff",
                                    fontFamily: FONT.MONSERRATSEMIBOLD,
                                    fontSize: 16,
                                    marginBottom: 6
                                }}>
                                    Your Industries
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    {industries.map((industry, idx) => (
                                        <View
                                            key={idx}
                                            style={{
                                                backgroundColor: CHIP_BG,
                                                borderRadius: 12,
                                                marginRight: 8,
                                                marginBottom: 8,
                                                paddingHorizontal: 18,
                                                paddingVertical: 9,
                                            }}>
                                            <Text style={{ color: HIGHLIGHT, fontSize: 13, fontFamily: FONT.MONSERRATMEDIUM }}>{industry}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <Divider width="120%" align="center" zIndex={10} />
                            {/* Interested Job Roles */}
                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{
                                    color: "#fff",
                                    fontFamily: FONT.MONSERRATSEMIBOLD,
                                    fontSize: 16,
                                    marginBottom: 6
                                }}>
                                    Interested Job Roles
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    {interests.map((interest, idx) => (
                                        <View
                                            key={idx}
                                            style={{
                                                backgroundColor: CHIP_BG,
                                                borderRadius: 12,
                                                marginRight: 8,
                                                marginBottom: 8,
                                                paddingHorizontal: 18,
                                                paddingVertical: 9,
                                            }}>
                                            <Text style={{ color: HIGHLIGHT, fontSize: 13, fontFamily: FONT.MONSERRATMEDIUM }}>{interest}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </LinearGradient>
                    </ScrollView>
                </View>
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
                name={fullName}
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
                    setShowShare(false);
                }}
                cardProfile={profile}
            />

            <BlockUserModal
                visible={blockAlertVisible}
                onClose={() => setBlockAlertVisible(false)}
                userName={fullName || "This user"}
                blockedUserId={profile?.user_id}
                onBlockSuccess={() => {
                    translateX.value = withSpring(-width);
                    rotate.value = withSpring(-ROTATION_DEGREE);
                    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
                        if (finished) runOnJS(onSwipeComplete)?.(profile.user_id, "blocked");
                    });
                }}
            />
        </>
    );
};

export default ProfileCard;
