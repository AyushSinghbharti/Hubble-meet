import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    StyleSheet,
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
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useConnectionStore } from "@/src/store/connectionStore";
import { usePitchStore } from "@/src/store/pitchStore";
import { FONT } from "../../../../assets/constants/fonts";
import styles from "./Styles/Styles";


// Constants
const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_DEGREE = 30;
const MAX_RIGHT_SWIPES = 10;


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
}: {
    profile: UserProfile;
    onSwipeComplete: any;
    onRejectSwipe: (profile: UserProfile) => void;
    rightSwipeCount: number;
    persistentSwipeCount: number;
    isExpanded: boolean;
    onToggleDetails: any;
    setError: any;
    isProfileCompleted: boolean;
    isPromptVisible: boolean;
}) => {
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);
    const buttonOpacity = useSharedValue(1);
    const rotationY = useSharedValue(0); // 0 for front, 1 for back


    const [requestSentVisible, setRequestSentVisible] = useState(false);
    const [rightSwipeAlertVisible, setRightSwipeAlertVisible] = useState(false);
    const [shareAlertVisible, setShareAlertVisible] = useState(false);
    const [blockAlertVisible, setBlockAlertVisible] = useState(false);
    const [thumbImageAlertVisible, setThumbImageAlertVisible] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const recommendations = useConnectionStore((s) => s.recommendations);
    const userId = useAuthStore((state) => state.userId);
    const { mutate: sendConnection } = useSendConnection();
    const route = useRouter();


    // Animated Card Styles
    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
            { perspective: 1000 },
            {
                rotateY: `${interpolate(rotationY.value, [0, 1], [0, 180])}deg`,
            },
        ],
        opacity: opacity.value,
    }));


    const handleImageTap = useCallback(() => {
        if (isAnimating || isPromptVisible) return;

        setIsAnimating(true);
        const target = isExpanded ? 0 : 1;
        rotationY.value = withTiming(target, { duration: 400 }, (finished) => {
            if (finished) runOnJS(setIsAnimating)(false);
        });
        onToggleDetails(profile);
    }, [onToggleDetails, profile, isExpanded, rotationY, isPromptVisible, isAnimating]);



    // useEffect(() => {
    //     rotationY.value = withTiming(isExpanded ? 1 : 0, { duration: 110 });
    // }, [isExpanded]);
    // Send connection (right swipe)
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
    // Gesture for flipping only the image
    const imageTapGesture = Gesture.Tap().onEnd(() => {
        "worklet";
        runOnJS(handleImageTap)();
    });


    // Pan gesture for swipe actions
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


    // Button animation
    const handleButtonPress = useCallback(() => {
        buttonOpacity.value = withTiming(0.5, { duration: 100 }, () => {
            buttonOpacity.value = withTiming(1, { duration: 100 });
        });
    }, [buttonOpacity]);


    // Share button
    const handleShareButtonPress = useCallback(
        (event: any) => {
            event.stopPropagation();
            handleButtonPress();
            setShareAlertVisible(true);
            setShowShare(true);
        },
        [handleButtonPress]
    );




    // Block button
    const handleRestartButtonPress = useCallback(
        (event: any) => {
            event.stopPropagation();
            handleButtonPress();
            setBlockAlertVisible(true);
        },
        [handleButtonPress]
    );


    // Thumb image tap (pitch)
    const handleThumbImagePress = useCallback(
        (event: any, userId: string) => {
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





    // Render card
    return (
        <>
            {!isExpanded ? (
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.card, cardStyle]}>
                        {/* Only wrap image for flip */}
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


                        <View style={styles.bottomActions}>
                            <TouchableOpacity
                                onPress={handleShareButtonPress}
                                activeOpacity={0.7}
                                accessibilityLabel={`Share ${profile?.full_name || "user"}'s profile`}
                                accessibilityRole="button"
                            >
                                <Animated.View style={[styles.actionButton]}>
                                    <Image
                                        source={require("../../../../assets/icons/share1.png")}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </Animated.View>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={handleRestartButtonPress}
                                activeOpacity={0.7}
                                accessibilityLabel={`Block ${profile?.full_name || "user"}`}
                                accessibilityRole="button"
                            >
                                <Animated.View style={[styles.actionButton]}>
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
                <GestureDetector gesture={imageTapGesture}>
                    <Animated.View style={styles.detailContent}>
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
                                        <Text
                                            style={[
                                                styles.name,
                                                { color: "#000", fontFamily: FONT.BOLD },
                                            ]}
                                        >
                                            {profile.full_name}
                                        </Text>
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


export default ProfileCard