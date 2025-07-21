import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";

import { Dimensions } from "react-native";
import { usePitchStore } from "@/src/store/pitchStore";
import { useConnectionStore } from "@/src/store/connectionStore";
import { Pitch } from "@/src/interfaces/pitchInterface";
import { getUserPitch } from "@/src/api/pitch";
import { useGetOtherUserPitch } from "@/src/hooks/usePitch";
import { useQueries } from "@tanstack/react-query";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TAB_BAR_HEIGHT = 100; // your custom tab bar height
const TOP_PADDING = 15; // from your container paddingTop
const SAFE_MARGIN = 18 * 2; // you want 18 top and bottom spacing

const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

// Dummy pitch and user
const pitches = [
  {
    pitch: {
      id: "1",
      thumbnail: "https://source.unsplash.com/1080x1920/?startup,office",
      videoUri:
        "https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      user: {
        name: "Hellen Whilliams",
        avatar: "https://randomuser.me/api/portraits/women/76.jpg",
        tagline: "Building the next-gen commerce app",
      },
      likes: 1580,
    },
    dummyUser: {
      name: "Ashley Joe",
      position: "Head of Product at Amazon",
      location: "Bengaluru, India",
      about:
        "I am a passionate and detail-oriented Product designer with a strong focus on creating user-centric designs that enhance usability.",
      industries: [
        "Computers & Electronics",
        "Government",
        "Marketing & Advertising",
      ],
      interests: ["UI Design", "Leadership", "Product Strategy"],
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
    },
  },
  {
    pitch: {
      id: "2",
      thumbnail: "https://source.unsplash.com/1080x1920/?technology,code",
      videoUri:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      user: {
        name: "Daniel Smith",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        tagline: "Passionate about AI & ML",
      },
      likes: 2350,
    },
    dummyUser: {
      name: "Sara Bright",
      position: "CTO at FintechLabs",
      location: "Mumbai, India",
      about:
        "Focused on building scalable financial infrastructure through cutting-edge technology.",
      industries: ["Finance", "AI", "Startups"],
      interests: ["Fintech", "Cloud", "Data Engineering"],
      image: "https://xsgames.co/randomusers/assets/avatars/male/31.jpg",
    },
  },
  {
    pitch: {
      id: "3",
      thumbnail: "https://source.unsplash.com/1080x1920/?design,workspace",
      videoUri:
        "https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      user: {
        name: "Monica Geller",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        tagline: "Designing delightful user journeys",
      },
      likes: 890,
    },
    dummyUser: {
      name: "John Doe",
      position: "UX Researcher at Google",
      location: "San Francisco, USA",
      about:
        "I specialize in understanding user behavior and creating intuitive experiences that resonate.",
      industries: ["Tech", "Education", "Healthcare"],
      interests: ["UX Research", "Accessibility", "Psychology"],
      image:
        "https://images.unsplash.com/photo-1546456073-6712f79251bb?auto=format&fit=crop&w=800&q=60",
    },
  },
  {
    pitch: {
      id: "4",
      thumbnail: "https://source.unsplash.com/1080x1920/?entrepreneur,startup",
      videoUri:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      user: {
        name: "Rajeev Anand",
        avatar: "https://randomuser.me/api/portraits/men/78.jpg",
        tagline: "SaaS product builder",
      },
      likes: 1240,
    },
    dummyUser: {
      name: "Nisha Reddy",
      position: "Co-Founder at Healthify",
      location: "Hyderabad, India",
      about:
        "Healthcare is evolving rapidly. I build products that make healthcare accessible and intuitive.",
      industries: ["Healthcare", "Biotech"],
      interests: ["Wellness Tech", "Product Strategy", "Operations"],
      image:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=60",
    },
  },
  {
    pitch: {
      id: "5",
      thumbnail: "https://source.unsplash.com/1080x1920/?developer,remote",
      videoUri:
        "https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      user: {
        name: "Alina Carter",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        tagline: "Remote dev advocate",
      },
      likes: 1923,
    },
    dummyUser: {
      name: "Ankit Sharma",
      position: "Engineering Manager at Zoho",
      location: "Chennai, India",
      about:
        "Leading distributed teams to build high-performance, scalable web applications.",
      industries: ["Software", "Remote Work"],
      interests: ["DevOps", "Team Management", "Microservices"],
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=60",
    },
  },
  {
    pitch: {
      id: "6",
      thumbnail: "https://source.unsplash.com/1080x1920/?business,team",
      videoUri:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      user: {
        name: "Carlos Mendes",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        tagline: "Let’s scale your business together",
      },
      likes: 3201,
    },
    dummyUser: {
      name: "Ritika Varma",
      position: "Marketing Lead at Razorpay",
      location: "Pune, India",
      about:
        "Driving brand growth and user acquisition through data-backed creative marketing.",
      industries: ["Marketing", "SaaS", "Payments"],
      interests: ["Growth Hacking", "Performance Ads", "Consumer Psychology"],
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60",
    },
  },
];

export default function PitchScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [currentPitch, setCurrentPitch] = useState(pitches[0].pitch);
  const [currentProfile, setCurrentProfile] = useState(pitches[0].dummyUser);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pitch = usePitchStore((state) => state.pitch);
  // update pitches when recommendationsId changes
  const recommendationsId = useConnectionStore((s) => s.recommendationsId);

  ///{PTIC}
  const pitchQueries = useQueries({
    queries: recommendationsId.map((userId) => ({
      queryKey: ["pitch", userId],
      queryFn: () => getUserPitch(userId),
      enabled: !!userId,
    })),
  });

  const userPitches = useMemo(() => {
    const result: Record<string, Pitch> = {};
    pitchQueries.forEach((query, idx) => {
      const id = recommendationsId[idx];
      if (query.data) result[id] = query.data;
    });
    return result;
  }, [pitchQueries, recommendationsId]);

  console.log(userPitches);

  ///{PTIC}

  useEffect(() => {
    const current = pitches[currentIndex];
    setCurrentPitch(current.pitch);
    setCurrentProfile(current.dummyUser);
  }, [currentIndex]);

  const handleFlip = () => {
    Animated.timing(rotateAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const navigateToMyPitch = () => {
    if (pitch) router.push("/pitchStack/myPitch");
    else
      router.push({
        pathname: "/pitchStack/createPitch",
        params: {
          item: JSON.stringify({
            name: null,
            desc: null,
            format: "Upload",
            pitchType: "Business",
            duration: 30,
            videoUrl: null,
          }),
        },
      });
  };

  // Animations
  const frontRotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = rotateAnim.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const backOpacity = rotateAnim.interpolate({
    inputRange: [90, 180],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToMyPitch}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../../../assets/icons/pitch2.png")}
              style={styles.pitchIcon}
            />
            <Text style={styles.headerText}>My Pitch</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Flip Card Area */}
      <View style={styles.cardArea}>
        {/* Front Card */}
        <Animated.View
          style={[
            styles.flipCard,
            {
              transform: [{ rotateY: frontRotation }],
              opacity: frontOpacity,
              zIndex: flipped ? 0 : 1,
            },
          ]}
        >
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={pitches}
            keyExtractor={(_, i) => i.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const offsetY = e.nativeEvent.contentOffset.y;
              const newIndex = Math.round(offsetY / ITEM_HEIGHT);
              if (newIndex !== currentIndex) setCurrentIndex(newIndex);
            }}
            renderItem={({ item, index }) => {
              const isVisible = Math.abs(index - currentIndex) <= 1;
              const scale = index === currentIndex ? 1 : 0.97;
              const opacity = index === currentIndex ? 1 : 0.5;

              return (
                <Animated.View
                  style={{
                    transform: [{ scale }],
                    opacity,
                    height: ITEM_HEIGHT,
                    marginVertical: 18,
                  }}
                >
                  {isVisible ? (
                    <MainCardWrapper
                      pitch={item.pitch}
                      onPress={handleFlip}
                      // isActive={index === currentIndex}
                      isActive={index === currentIndex && !flipped}
                    />
                  ) : null}
                </Animated.View>
              );
            }}
          />
        </Animated.View>

        {/* Back Card */}
        <Animated.View
          style={[
            styles.flipCard,
            styles.absoluteFill,
            {
              transform: [{ rotateY: backRotation }],
              opacity: backOpacity,
              zIndex: flipped ? 1 : 0,
            },
          ]}
        >
          <FlipCardWrapper item={currentProfile} onPress={handleFlip} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    top: 70,
    zIndex: 2,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  pitchIcon: {
    height: 24,
    aspectRatio: 1,
  },
  headerText: {
    fontSize: 10,
    color: "#64748B",
  },
  cardArea: {
    flex: 1,
    position: "relative",
  },
  flipCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden",
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   FlatList,
// } from "react-native";
// import { Image } from "expo-image";
// import { useRouter } from "expo-router";
// import FlipCardWrapper from "../../../components/pitchScreenComps/flipCardWrapper";
// import MainCardWrapper from "../../../components/pitchScreenComps/mainCardWrapper";
// import { Dimensions } from "react-native";
// import { usePitchStore } from "@/src/store/pitchStore";
// import { useConnectionStore } from "@/src/store/connectionStore";
// import { getUserPitch } from "@/src/api/pitch";
// import { useQueries } from "@tanstack/react-query";
// import { Pitch } from "@/src/interfaces/pitchInterface";
// import { UserProfile } from "@/src/interfaces/profileInterface";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// const TAB_BAR_HEIGHT = 100;
// const TOP_PADDING = 15;
// const SAFE_MARGIN = 36;
// const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - TOP_PADDING - SAFE_MARGIN;

// export default function PitchScreen() {
//   const router = useRouter();
//   const [flipped, setFlipped] = useState(false);
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const pitch = usePitchStore((state) => state.pitch);
//   const recommendations = useConnectionStore((s) => s.recommendations);
//   const recommendationsId = useConnectionStore((s) => s.recommendationsId);
//   const addRecommendationsIdBulk = useConnectionStore(
//     (s) => s.addRecommendationsIdBulk
//   );
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const setRecommendationsId = useConnectionStore(
//     (s) => s.setRecommendationsId
//   );

//   const handleProfilePress = (userId: string) => {
//     const updated = [
//       userId,
//       ...recommendationsId.filter((id) => id !== userId),
//     ];
//     setRecommendationsId(updated); // Replaces entire order
//     router.push("/connect");
//   };

//   const pitchQueries = useQueries({
//     queries: recommendationsId.map((userId) => ({
//       queryKey: ["pitch", userId],
//       queryFn: () => getUserPitch(userId),
//       enabled: !!userId,
//     })),
//   });

//   const validPitches = useMemo(() => {
//     if (!pitchQueries.length) return [];
//     return recommendations
//       .map((profile) => {
//         const pitch = pitchQueries.find(
//           (q) => q.data?.user_id === profile.user_id
//         )?.data;
//         if (!pitch) return null;
//         return {
//           pitch: {
//             id: pitch.id,
//             thumbnail: "",
//             videoUri: pitch.url,
//             user: {
//               name: profile.full_name,
//               avatar: profile.image,
//               tagline: pitch.pitch_caption || "",
//             },
//             likes: 0,
//           },
//           profile,
//         };
//       })
//       .filter(Boolean);
//   }, [pitchQueries, recommendations]);

//   const [currentPitch, setCurrentPitch] = useState(
//     validPitches[0]?.pitch || null
//   );
//   const [currentProfile, setCurrentProfile] = useState(
//     validPitches[0]?.profile || null
//   );

//   useEffect(() => {
//     const target = validPitches[currentIndex];
//     if (target) {
//       setCurrentPitch(target.pitch);
//       setCurrentProfile(target.profile);
//     }
//   }, [currentIndex]);

//   const handleFlip = () => {
//     Animated.timing(rotateAnim, {
//       toValue: flipped ? 0 : 180,
//       duration: 400,
//       easing: Easing.ease,
//       useNativeDriver: true,
//     }).start(() => setFlipped(!flipped));
//   };

//   const navigateToMyPitch = () => {
//     if (pitch) router.push("/pitchStack/myPitch");
//     else
//       router.push({
//         pathname: "/pitchStack/createPitch",
//         params: JSON.stringify({
//           name: null,
//           desc: null,
//           format: "Upload",
//           pitchType: "Business",
//           duration: 30,
//           videoUrl: null,
//         }),
//       });
//   };

//   const frontRotation = rotateAnim.interpolate({
//     inputRange: [0, 180],
//     outputRange: ["0deg", "180deg"],
//   });

//   const backRotation = rotateAnim.interpolate({
//     inputRange: [0, 180],
//     outputRange: ["180deg", "360deg"],
//   });

//   const frontOpacity = rotateAnim.interpolate({
//     inputRange: [0, 90],
//     outputRange: [1, 0],
//     extrapolate: "clamp",
//   });

//   const backOpacity = rotateAnim.interpolate({
//     inputRange: [90, 180],
//     outputRange: [0, 1],
//     extrapolate: "clamp",
//   });

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={navigateToMyPitch}>
//           <View style={styles.iconContainer}>
//             <Image
//               source={require("../../../../assets/icons/pitch2.png")}
//               style={styles.pitchIcon}
//             />
//             <Text style={styles.headerText}>My Pitch</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Card View */}
//       <View style={styles.cardArea}>
//         {/* Front Side */}
//         <Animated.View
//           style={[
//             styles.flipCard,
//             {
//               transform: [{ rotateY: frontRotation }],
//               opacity: frontOpacity,
//               zIndex: flipped ? 0 : 1,
//             },
//           ]}
//         >
//           <FlatList
//             style={{ flex: 1 }}
//             contentContainerStyle={{ flexGrow: 1 }}
//             data={validPitches}
//             keyExtractor={(item) => item.pitch.id}
//             pagingEnabled
//             showsVerticalScrollIndicator={false}
//             onMomentumScrollEnd={(e) => {
//               const offsetY = e.nativeEvent.contentOffset.y;
//               const newIndex = Math.round(offsetY / ITEM_HEIGHT);
//               if (newIndex !== currentIndex) setCurrentIndex(newIndex);
//             }}
//             renderItem={({ item, index }) => {
//               const isVisible = Math.abs(index - currentIndex) <= 1;
//               const scale = index === currentIndex ? 1 : 0.97;
//               const opacity = index === currentIndex ? 1 : 0.5;

//               return (
//                 <Animated.View
//                   style={{
//                     transform: [{ scale }],
//                     opacity,
//                     height: ITEM_HEIGHT,
//                     marginVertical: 18,
//                   }}
//                 >
//                   {isVisible && (
//                     <MainCardWrapper
//                       pitch={item.pitch}
//                       onPress={() => handleProfilePress(item.profile.user_id)}
//                       isActive={index === currentIndex && !flipped}
//                     />
//                   )}
//                 </Animated.View>
//               );
//             }}
//           />
//         </Animated.View>

//         {/* Back Side */}
//         {/* <Animated.View
//           style={[
//             styles.flipCard,
//             styles.absoluteFill,
//             { transform: [{ rotateY: backRotation }], opacity: backOpacity, zIndex: flipped ? 1 : 0 },
//           ]}
//         >
//           {currentProfile && <FlipCardWrapper item={currentProfile} onPress={handleFlip} />}
//         </Animated.View> */}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 18,
//     paddingTop: 16,
//     paddingBottom: 100,
//   },
//   headerContainer: {
//     position: "absolute",
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     top: 70,
//     zIndex: 2,
//   },
//   iconContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 2,
//   },
//   pitchIcon: {
//     height: 24,
//     aspectRatio: 1,
//   },
//   headerText: {
//     fontSize: 10,
//     color: "#64748B",
//   },
//   cardArea: {
//     flex: 1,
//     position: "relative",
//   },
//   flipCard: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backfaceVisibility: "hidden",
//   },
//   absoluteFill: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });
