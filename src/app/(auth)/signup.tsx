import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";
import ErrorAlert from "../../components/errorAlert";
import { useRouter } from "expo-router";
import TermDetailModal from "../../components/termDetailModal";
import colourPalette from "../../theme/darkPaletter";
import { LinearGradient } from "expo-linear-gradient";
import ManualBlur from "../../components/BlurComp";
import RandomBackgroundImages from "../../components/RandomBGImage";
import { useSignup, useSocialLogin } from "../../hooks/useAuth";
import { SocialUserPayload, useSocialAuth } from "@/src/hooks/useSocialAuth";
import { fetchUserProfile } from "@/src/api/profile";
import { useAuthStore } from "@/src/store/auth";

const GOOGLE_ICON = "https://img.icons8.com/color/512/google-logo.png";
const APPLE_ICON = "https://img.icons8.com/ios-filled/512/mac-os.png";
const MICROSOFT_ICON = "https://img.icons8.com/color/512/microsoft.png";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const defaultCountry = {
  code: "IN",
  name: "India",
  dial_code: "+91",
  flag: "https://flagcdn.com/w2560/in.png",
};

const { width } = Dimensions.get("window");

const RegisterModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedFlag, setSelectedFlag] = useState(defaultCountry);
  const [termAccept, toggleTerm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [termModalVisible, setTermModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef<View>(null);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const { mutate: signup } = useSignup();
  const { mutate: socialLogin } = useSocialLogin();
  const { signInWithGoogle } = useSocialAuth();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSignUp = () => {
    if (!email) {
      setEmailError(true);
      setError("Email is required");
      return;
    }
    if (!phoneNumber) {
      setPhoneError(true);
      setError("Phone number is required");
      return;
    }

    signup(
      { phone: selectedFlag.dial_code + phoneNumber, email },
      {
        onSuccess: (res) => {
          onClose();
          router.push({
            pathname: "/otpVerify",
            params: {
              phone: selectedFlag.dial_code + phoneNumber,
              res: JSON.stringify(res),
              type: "signup",
            },
          });
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Signup failed");
        },
      }
    );
  };

  const handleTermLogic = () => {
    if (!termAccept) setTermModalVisible(true);
    else toggleTerm(false);
  };

  const handleGoogleButtonPress = async () => {
    const payload = await signInWithGoogle();
    socialLogin(
      {
        provider: "google",
        providerId: payload?.data.user.id ?? "",
        email: payload?.email ?? "",
      },
      {
        onSuccess: async (res) => {
          const profile = await fetchUserProfile(res.user.id);
          if (profile) {
            setUser(profile);
            router.replace("/connect");
          } else {
            setUser(payload);
            router.push("/profileSetup");
          }
        },
        onError: () => {
          setError("Social signup failed");
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <KeyboardAvoidingView behavior="padding" style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          {error && <ErrorAlert message={error} onClose={() => setError("")} />}

          {/* Register Header */}
          <Text style={styles.registerHeader}>Register</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailError(false);
              }}
              placeholder="Email ID"
              placeholderTextColor="#FFF"
              keyboardType="email-address"
              style={styles.textInput}
            />
          </View>

          {/* Phone Input Row */}
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={styles.flagBox}
              onPress={() =>
                flagBoxRef.current?.measureInWindow((x, y) => {
                  setFlagBoxPosition({ x, y });
                  setModalVisible(true);
                })
              }
            >
              <View ref={flagBoxRef} style={styles.flagContent}>
                <Image
                  source={{ uri: selectedFlag.flag }}
                  style={styles.flagIcon}
                />
                <Text style={styles.countryCode}>{selectedFlag.dial_code}</Text>
                <FontAwesome name="chevron-down" size={12} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <View style={styles.phoneInputContainer}>
              <TextInput
                value={phoneNumber}
                onChangeText={(t) => {
                  setPhoneNumber(t);
                  setPhoneError(false);
                }}
                placeholder="Phone Number"
                placeholderTextColor="#FFF"
                keyboardType="phone-pad"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Terms Text */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text
                style={styles.linkText}
                onPress={() => setTermModalVisible(true)}
              >
                Privacy Policy
              </Text>{" "}
              and{" "}
              <Text
                style={styles.linkText}
                onPress={() => setTermModalVisible(true)}
              >
                Terms of Service
              </Text>
            </Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor:
                  phoneNumber && email
                    ? colourPalette.buttonPrimary
                    : colourPalette.buttonPrimaryDisabled,
              },
            ]}
            onPress={handleSignUp}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>
              Or <Text style={styles.signupBold}>Signup</Text> with
            </Text>
            <View style={styles.line} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleButtonPress}
            >
              <Image source={{ uri: GOOGLE_ICON }} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{ uri: MICROSOFT_ICON }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.loginLink} onPress={onClose}>
                Login
              </Text>
            </Text>
          </View>

          {/* Modals */}
          <SelectCountryModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelect={(flag) => {
              setSelectedFlag(flag);
              setModalVisible(false);
            }}
          />

          <TermDetailModal
            visible={termModalVisible}
            onClose={() => setTermModalVisible(false)}
            onAgree={() => {
              toggleTerm(true);
              setTermModalVisible(false);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RegisterModal;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "100%",
  },
  registerHeader: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 24,
    fontFamily: "InterSemiBold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#4B4B4B",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "InterRegular",
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  phoneContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  flagBox: {
    backgroundColor: "#4B4B4B",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 75,
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  flagContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  flagIcon: {
    width: 18,
    height: 13,
    resizeMode: "contain",
  },
  countryCode: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "InterMedium",
    marginRight: 2,
  },
  phoneInputContainer: {
    flex: 1,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    color: "#D1D5DB",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "InterRegular",
  },
  linkText: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
    fontFamily: "InterMedium",
  },
  verifyButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "InterSemiBold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#6B7280",
  },
  orText: {
    color: "#D1D5DB",
    fontSize: 13,
    marginHorizontal: 12,
    fontFamily: "InterRegular",
  },
  signupBold: {
    color: "#FFFFFF",
    fontFamily: "InterSemiBold",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    backgroundColor: "#FFFFFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    color: "#D1D5DB",
    fontSize: 14,
    fontFamily: "InterRegular",
  },
  loginLink: {
    color: "#FFFFFF",
    fontFamily: "InterSemiBold",
    textDecorationLine: "underline",
  },
});
