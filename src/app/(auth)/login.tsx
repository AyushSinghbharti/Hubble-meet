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
import { Link, useRouter } from "expo-router";
import colourPalette from "../../theme/darkPaletter";
import { loginStyles as styles } from "./Styles/Styles";
import { useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";
import ManualBlur from "../../components/BlurComp";
import ErrorAlert from "../../components/errorAlert";
import RandomBackgroundImages from "../../components/RandomBGImage";
import { useLogin } from "../../hooks/useAuth";

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
}: {
  children?: React.ReactNode;
  image?: string;
}) => (
  <TouchableOpacity style={styles.iconBtn}>
    {image ? <Image source={{ uri: image }} style={styles.icon} /> : children}
  </TouchableOpacity>
);

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const router = useRouter();
  const [selectedFlag, setSelectedFlag] = useState<Country>({
    code: "IN",
    name: "India",
    dial_code: "+91",
    flag: "https://flagcdn.com/w2560/in.png",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef<View>(null);
  const [error, setError] = useState<string>("");
  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    login(
      { phone: phoneNumber, email: "testuser@email.com" },
      {
        onSuccess: (res) => {
          router.push({
            pathname: "/otpVerify",
            params: {phone: phoneNumber, res: JSON.stringify(res), type: "login"},
          });
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
    router.replace("/signup");
  };

  return (
    <RandomBackgroundImages style={styles.container}>
      <Image
        source={require("../../../assets/logo/logo2.png")}
        style={styles.logo}
      />
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

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
            },
          ]}
          onPress={handleLogin}
        >
          <Text
            style={[
              styles.loginText,
              {
                color: phoneNumber ? "#000" : "#64748B",
              },
            ]}
          >
            Verify
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <TouchableOpacity onPress={handleSignup} style={styles.signupText}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
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
        <IconButton image={GOOGLE_ICON} />
        <IconButton>
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
        position={flagBoxPosition}
      />
    </RandomBackgroundImages>
  );
}
