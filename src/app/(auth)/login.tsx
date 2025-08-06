import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colourPalette from "../../theme/darkPaletter";
import { loginStyles as styles } from "./Styles/Styles";
import { useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";
import ManualBlur from "../../components/BlurComp";
import RandomBackgroundImages from "../../components/RandomBGImage";
import { useLogin, useSocialLogin } from "../../hooks/useAuth";
import { SocialUserPayload, useSocialAuth } from "@/src/hooks/useSocialAuth";
import { fetchUserProfile } from "@/src/api/profile";
import { useAuthStore } from "@/src/store/auth";
import RegisterModal from "./signup";
import OtpModal from "./otpVerify";
import { ActivityIndicator } from "react-native-paper";
import { FONT } from "@/assets/constants/fonts";

type Country = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

const FLAG_ICON = "https://flagcdn.com/w40/in.png";
const GOOGLE_ICON = "https://img.icons8.com/color/512/google-logo.png";
const FACEBOOK_ICON =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy0dDdi3KJgMq_87aJt9us_0yh69ewaKgUzg&s";

const IconButton = ({
  children,
  image,
  onPress,
}: {
  children?: React.ReactNode;
  image?: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.iconBtn} onPress={onPress}>
    {image ? <Image source={{ uri: image }} style={styles.icon} /> : children}
  </TouchableOpacity>
);

export default function Login() {
  const [userInfo, setUserInfo] = useState();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const router = useRouter();
  const [selectedFlag, setSelectedFlag] = useState<Country>({
    code: "IN",
    name: "India",
    dial_code: "+91",
    flag: "https://flagcdn.com/w2560/in.png",
  });
  const [registerVisible, setRegisterVisible] = useState(false);
  const [viewOtpModal, setOtpModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef<View>(null);
  const [error, setError] = useState<string>("");
  const { mutate: login, isPending } = useLogin();
  const { mutate: socialLogin } = useSocialLogin();

  const { signInWithGoogle, signInWithApple, loading } = useSocialAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<SocialUserPayload | null>(
    null
  );
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const fetchProfileAndNavigate = async () => {
      if (!userId) return;
      try {
        const profile = await fetchUserProfile(userId);
        if (profile) {
          setUser(profile);
          router.replace("/connect");
        } else {
          setUser({
            email: userProfile?.email,
            profile_picture_url: userProfile?.photoURL || undefined,
            full_name: userProfile?.displayName || "",
            phone: userProfile?.phoneNumber || "",
          });
          router.push("/profileSetup");
        }
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 404) {
          setUser({
            email: userProfile?.email,
            profile_picture_url: userProfile?.photoURL || undefined,
            full_name: userProfile?.displayName || "",
            phone: userProfile?.phoneNumber || "",
          });

          router.push("/profileSetup");
        } else {
          console.error("Failed to fetch user profile after social login", err);
          setError("Failed to complete login. Please try again.");
        }
      }
    };

    fetchProfileAndNavigate();
  }, [userId]);

  const handleGoogleButtonPress = async () => {
    setUserId(null);
    const payload = await signInWithGoogle();
    const currentUser = payload;

    socialLogin(
      {
        provider: "google",
        providerId: payload?.data.user.id ?? "",
        email: payload?.email ?? "",
      },
      {
        onSuccess: async (res) => {
          setUserId(res.user.id);
          setUserProfile(currentUser);
        },
        onError: (err: any) => {
          console.log(err);
          setError(
            err?.response?.data?.message || "Login failed. Please try again"
          );
        },
      }
    );
  };

  const handleAppleButtonPress = async () => {
    setUserId(null);

    let payload: SocialUserPayload | null = null;

    try {
      payload = await signInWithApple();
    } catch (err: any) {
      console.error("Apple Sign-In Error:", err);

      if (
        err?.message?.includes("not available") ||
        err?.message?.includes("Apple Sign-In is not available")
      ) {
        setError("Apple Sign-In is not supported on this device.");
      } else if (err?.code === "ERR_CANCELED") {
        setError("Apple Sign-In was cancelled.");
      } else {
        setError("Apple Sign-In failed. Please try again.");
      }
      return;
    }

    if (!payload) {
      setError("Apple Sign-In was cancelled.");
      return;
    }

    const currentUser = payload;
    console.log("Apple payload", JSON.stringify(payload, null, 4));

    socialLogin(
      {
        provider: "apple",
        providerId: payload?.data?.user ?? "", // Apple returns `user` string ID
        email: payload?.email ?? "",
      },
      {
        onSuccess: async (res) => {
          setUserId(res.user.id);
          setUserProfile(currentUser);
        },
        onError: (err: any) => {
          console.log("Apple login error:", err);
          setError(
            err?.response?.data?.message || "Login failed. Please try again"
          );
        },
      }
    );
  };

  const handleLogin = () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    login(
      { phone: selectedFlag.dial_code + phoneNumber },
      {
        onSuccess: (res) => {
          setOtpModal(true);
        },
        onError: (err: any) => {
          console.log(err);
          setError(
            err?.response?.data?.message || "Login failed. Please try again."
          );
        },
      }
    );
  };

  const handleSignup = () => {
    setRegisterVisible(true);
  };

  return (
    <RandomBackgroundImages style={styles.container} type="Dark" imageNumber={3}>
      <Image
        source={require("../../../assets/logo/logo2.png")}
        style={styles.logo}
      />
      <KeyboardAvoidingView behavior="position" style={styles.form}>
        <View style={[styles.phoneContainer]}>
          <ManualBlur style={styles.flagBox}>
            <TouchableOpacity
              onPress={() => {
                flagBoxRef.current?.measureInWindow((x, y, width, height) => {
                  setFlagBoxPosition({ x, y });
                  setModalVisible(true);
                });
              }}
            >
              <View
                ref={flagBoxRef}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: selectedFlag.flag }}
                  style={styles.flagIcon}
                />
                <Text style={styles.countryCode}>{selectedFlag.dial_code}</Text>
                <FontAwesome name="chevron-down" size={12} color="#fff" />
              </View>
            </TouchableOpacity>
          </ManualBlur>
          <View style={{ flex: 1 }}>
            <ManualBlur
              style={[
                styles.phoneInput,
                {
                  borderColor: error
                    ? colourPalette.errorButton
                    : colourPalette.inputBorder,
                },
              ]}
            >
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone number"
                placeholderTextColor="#fff"
                keyboardType="phone-pad"
                style={[styles.phoneText]}
              />
            </ManualBlur>
          </View>
        </View>
        {error && (
          <Text
            style={{
              position: "absolute",
              top: 48,
              color: "red",
              fontSize: 12,
              fontFamily: FONT.MONSERRATITALICMEDIUM,
            }}
          >
            {error}
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.loginBtn,
            {
              backgroundColor: phoneNumber
                ? colourPalette.buttonPrimary
                : colourPalette.buttonPrimaryDisabled,
              borderColor: phoneNumber
                ? colourPalette.buttonPrimaryBorder
                : colourPalette.buttonPrimaryBorderDisabled,
              shadowColor: phoneNumber
                ? colourPalette.buttonPrimary
                : colourPalette.buttonPrimaryDisabled,
            },
          ]}
          onPress={!isPending ? handleLogin : () => {}}
        >
          {!isPending ? (
            <Text style={[styles.loginText]}>Login</Text>
          ) : (
            <ActivityIndicator size={"small"} color="#666" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <TouchableOpacity onPress={handleSignup} style={styles.signupText}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Register</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>
          Or <Text style={styles.bold}>Signup</Text> with
        </Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <IconButton image={GOOGLE_ICON} onPress={handleGoogleButtonPress} />
        <IconButton onPress={handleAppleButtonPress}>
          <FontAwesome name="apple" size={24} color="black" />
        </IconButton>
        <IconButton image={FACEBOOK_ICON} />
      </View>

      {/*Modal*/}
      <SelectCountryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(code) => {
          setSelectedFlag(code);
          setModalVisible(false);
        }}
      />

      <RegisterModal
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
      />

      <OtpModal
        visible={viewOtpModal}
        onClose={() => setOtpModal(false)}
        selectedFlag={selectedFlag}
        phone={phoneNumber}
        type="login"
      />
    </RandomBackgroundImages>
  );
}
