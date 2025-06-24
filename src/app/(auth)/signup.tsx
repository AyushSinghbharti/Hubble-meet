import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";
import ErrorAlert from "../../components/errorAlert";
import { useRouter } from "expo-router";
import TermDetailModal from "../../components/termDetailModal";
import colourPalette from "../../theme/darkPaletter";
import { LinearGradient } from "expo-linear-gradient";
import { loginStyles as styles } from "./Styles/Styles";

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
  const [termAccept, toogleTerm] = useState<Boolean>(false);
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
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [acceptTermError, setAcceptTermError] = useState(
    "Please accept the Terms & Conditions to proceed"
  );
  const [showTermError, setShowTermError] = useState(false);

  const handleSignUp = () => {
    if (!termAccept) {
      setShowTermError(true);
      setTermModalVisible(!modalVisible);
      return;
    }
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      return;
    }

    router.push("/otpVerify");
  };

  const handleAgreeTerm = () => {
    setTermModalVisible(false);
    toogleTerm(true);
    setShowTermError(false);
  };

  const handleTermLogic = () => {
    if (!termAccept) {
      setTermModalVisible(!termModalVisible);
    } else {
      toogleTerm(!termAccept);
      setShowTermError(false);
    }
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/images/LoginPageBG.jpg")}
      style={[styles.container]}
    >
      <LinearGradient
        colors={["transparent", "#000000CC", "#000"]}
        style={[styles.container, { justifyContent: "flex-end", paddingBottom: 65 }]}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logoAbsolute}
        />
        {showTermError ? (
          <ErrorAlert
            message={acceptTermError}
            onClose={() => setShowTermError(!showTermError)}
          />
        ) : (
          <Text style={styles.title}>Sign Up</Text>
        )}
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.emailContainer,
                { marginBottom: emailError ? 0 : 16 },
              ]}
            >
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                style={[
                  styles.phoneInput,
                  {
                    borderColor: emailError
                      ? colourPalette.errorButton
                      : colourPalette.inputBorder,
                  },
                ]}
              />
            </View>
            {emailError && (
              <Text style={[styles.error, { marginBottom: 8, marginTop: 2 }]}>
                {emailError}
              </Text>
            )}
          </View>

          <Text style={styles.label}>Phone number</Text>
          <View
            style={[
              styles.phoneContainer,
              { marginBottom: phoneError ? 0 : 16 },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                flagBoxRef.current?.measureInWindow((x, y, width, height) => {
                  setFlagBoxPosition({ x, y });
                  setModalVisible(true);
                });
              }}
              style={styles.flagBox}
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
                <FontAwesome name="chevron-down" size={12} color="#656565" />
              </View>
            </TouchableOpacity>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              style={[
                styles.phoneInput,
                { borderColor: phoneError ? "red" : "black" },
              ]}
            />
          </View>
          {phoneError && (
            <Text style={[styles.error, { marginBottom: 9, marginTop: 2 }]}>
              {phoneError}
            </Text>
          )}

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
                  // backgroundColor: !termAccept ? "#fff" : "#000",
                  backgroundColor: !termAccept ? colourPalette.surface : "#000",
                },
              ]}
            >
              {termAccept && (
                <FontAwesome name="check" size={16} color="#fff" />
              )}
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
                backgroundColor:
                  phoneNumber && termAccept && email
                    ? colourPalette.buttonPrimary
                    : colourPalette.buttonPrimaryDisabled,
                borderColor:
                  phoneNumber && termAccept && email
                    ? colourPalette.buttonPrimaryBorder
                    : colourPalette.buttonSecondaryBorderDisabled,
              },
            ]}
            onPress={handleSignUp}
          >
            <Text style={styles.loginText}>Verify</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={styles.signupText}
          onPress={() => router.replace("/login")}
        >
          Don’t have an account? <Text style={styles.signupLink}>Log In</Text>
        </Text>

        <View style={styles.orContainer}>
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
      </LinearGradient>
    </ImageBackground>
  );
}