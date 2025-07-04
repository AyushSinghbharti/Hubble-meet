import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";
import ErrorAlert from "../../components/errorAlert";
import { useRouter } from "expo-router";
import TermDetailModal from "../../components/termDetailModal";
import colourPalette from "../../theme/darkPaletter";
import { LinearGradient } from "expo-linear-gradient";
import { loginStyles as styles } from "./Styles/Styles";
import ManualBlur from "../../components/BlurComp";
import RandomBackgroundImages from "../../components/RandomBGImage";
import { useSignup } from "../../hooks/useAuth";

type Country = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

const GOOGLE_ICON = "https://img.icons8.com/color/512/google-logo.png";
const FACEBOOK_ICON =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy0dDdi3KJgMq_87aJt9us_0yh69ewaKgUzg&s";

export default function SignUp() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [termAccept, toogleTerm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [selectedFlag, setSelectedFlag] = useState<Country>({
    code: "IN",
    name: "India",
    dial_code: "+91",
    flag: "https://flagcdn.com/w2560/in.png",
  });
  const [termModalVisible, setTermModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef<View>(null);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const { mutate: signup, isPending } = useSignup();

  const handleSignUp = () => {
    if (!termAccept) {
      setError("Please accept the Terms & Conditions to proceed");
      setTermModalVisible(!modalVisible);
      return;
    }
    if (!email) {
      setError("Email is required");
      setEmailError(true);
      return;
    }
    if (!phoneNumber) {
      setError("Phone number is required");
      setPhoneError(true);
      return;
    }

    signup(
      { phone: phoneNumber, email: email },
      {
        onSuccess: (res) => {
          router.push({
            pathname: "/otpVerify",
            params: {phone: phoneNumber, res},
          });
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

  const handleLogin = () => {
    router.replace("/login");
  };

  const handleAgreeTerm = () => {
    setTermModalVisible(false);
    toogleTerm(true);
  };

  const handleTermLogic = () => {
    if (!termAccept) {
      setTermModalVisible(!termModalVisible);
    } else {
      toogleTerm(!termAccept);
    }
  };

  return (
    <RandomBackgroundImages
      style={[
        styles.container,
        { justifyContent: "flex-end", paddingBottom: 65 },
      ]}
    >
      <Image
        source={require("../../../assets/logo/logo2.png")}
        style={styles.logoAbsolute}
      />

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <KeyboardAvoidingView behavior="padding" style={styles.form}>
        <ManualBlur
          style={[
            styles.emailContainer,
            styles.phoneInput,
            {
              flex: 0,
              borderColor: emailError
                ? colourPalette.errorButton
                : colourPalette.inputBorder,
            },
          ]}
        >
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            style={[styles.phoneText, { flex: 1 }]}
          />
        </ManualBlur>

        <View style={[styles.phoneContainer, { marginBottom: 20 }]}>
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
                borderColor: phoneError
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
        <View
          style={{
            flexDirection: "row",
            paddingTop: 8,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleTermLogic}
            style={[
              styles.termCheckBox,
              {
                backgroundColor: !termAccept
                  ? colourPalette.surface
                  : colourPalette.buttonTritary,
              },
            ]}
          >
            {termAccept && <FontAwesome name="check" size={16} color="#fff" />}
          </TouchableOpacity>
          <Text
            style={styles.termFont}
            onPress={() => setTermModalVisible(!termModalVisible)}
          >
            I agree with{" "}
            <Text
              style={{
                textDecorationLine: "underline",
                fontFamily: "InterBold",
              }}
            >
              Private Policy{" "}
            </Text>
            and{" "}
            <Text
              style={{
                textDecorationLine: "underline",
                fontFamily: "InterBold",
              }}
            >
              Terms and Conditions
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.loginBtn,
            {
              marginBottom: 20,
              backgroundColor:
                phoneNumber && termAccept && email
                  ? colourPalette.buttonPrimary
                  : colourPalette.buttonPrimaryDisabled,
              borderColor:
                phoneNumber && termAccept && email
                  ? colourPalette.buttonPrimaryBorder
                  : colourPalette.buttonPrimaryBorderDisabled,
            },
          ]}
          onPress={handleSignUp}
        >
          <Text
            style={[
              styles.loginText,
              {
                color: phoneNumber && termAccept && email ? "#000" : "#64748B",
              },
            ]}
          >
            Verify
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Text style={styles.signupText} onPress={handleLogin}>
        Don’t have an account? <Text style={styles.signupLink}>Log In</Text>
      </Text>

      <View style={[styles.orContainer]}>
        <View style={styles.line} />
        <Text style={styles.orText}>
          Or <Text style={styles.orBold}>Signup</Text> with
        </Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.iconBtn}>
          <Image source={{ uri: GOOGLE_ICON }} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <FontAwesome name="apple" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Image source={{ uri: FACEBOOK_ICON }} style={styles.icon} />
        </TouchableOpacity>
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

      <TermDetailModal
        visible={termModalVisible}
        onClose={() => setTermModalVisible(!termModalVisible)}
        onAgree={handleAgreeTerm}
      />
    </RandomBackgroundImages>
  );
}
