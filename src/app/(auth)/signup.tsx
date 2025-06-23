import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";
import ErrorAlert from "../../components/errorAlert";
import { useRouter } from "expo-router";
import TermDetailModal from "../../components/termDetailModal";
import colourPalette from "../../theme/darkPaletter";

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
  const [emailError, setEmailError] = useState("Invalid email address");
  const [phoneError, setPhoneError] = useState("Invalid phone number");
  const [acceptTermError, setAcceptTermError] = useState(
    "Please accept the Terms & Conditions to proceed"
  );
  const [showTermError, setShowTermError] = useState(false);

  const handleSignUp = () => {
    if (!termAccept) {
      setShowTermError(true);
      return;
    }

    router.push("/otpVerify");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
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
              { marginBottom: emailError ? 0 : 8 },
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
          style={[styles.phoneContainer, { marginBottom: phoneError ? 0 : 9 }]}
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
            onPress={() => toogleTerm(!termAccept)}
            style={[
              styles.termCheckBox,
              {
                // backgroundColor: !termAccept ? "#fff" : "#000",
                backgroundColor: !termAccept ? colourPalette.surface : "#000",
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
              //  backgroundColor: phoneNumber ? "#000" : "#CBD5E1",
              backgroundColor:
                phoneNumber && termAccept && email
                  ? colourPalette.buttonSecondary
                  : colourPalette.buttonSecondaryDisabled,
              borderColor:
                phoneNumber && termAccept && email
                  ? colourPalette.buttonSecondaryBorder
                  : colourPalette.buttonSecondaryBorderDisabled,
            },
          ]}
          onPress={handleSignUp}
        >
          <Text style={styles.loginText}>Verify</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signupText} onPress={() => router.replace("/loginPage")}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    backgroundColor: colourPalette.backgroundPrimary,
    alignItems: "center",
    width: "100%",
  },
  logo: {
    height: 40,
    width: 248,
    marginTop: 80,
    marginBottom: 65,
  },
  title: {
    fontFamily: "InterBold",
    fontSize: 22,
    // color: "black",
    color: colourPalette.textPrimary,
    marginBottom: 36,
  },
  form: {
    width: "100%",
    paddingHorizontal: 16,
  },
  label: {
    // color: "#000",
    color: colourPalette.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: "row",
  },
  error: {
    color: colourPalette.errorText,
    fontFamily: "Inter",
  },
  phoneContainer: {
    flexDirection: "row",
  },
  flagBox: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#fff",
    // borderColor: "#CBD5E1",
    backgroundColor: colourPalette.inputBackground,
    borderColor: colourPalette.inputBorder,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  flagIcon: {
    width: 20,
    height: 14,
    marginRight: 5,
  },
  countryCode: {
    fontFamily: "Inter",
    color: colourPalette.textPrimary,
    marginRight: 8,
    marginLeft: 3,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colourPalette.inputBackground,
    borderColor: colourPalette.inputBorder,
    // backgroundColor: "#fff",
    // borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colourPalette.textPrimary,
  },
  termCheckBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  termFont: {
    color: colourPalette.textPrimary,
    fontSize: 14,
    width: "90%",
    fontFamily: "Inter",
  },
  loginBtn: {
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  loginText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "InterBold",
  },
  signupText: {
    color: colourPalette.textPrimary,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 35,
  },
  signupLink: {
    fontFamily: "InterBold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  orText: {
    color: colourPalette.textPrimary,
    fontSize: 14,
    fontFamily: "Inter",
  },
  orBold: {
    fontSize: 16,
    fontFamily: "InterBold",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colourPalette.divider,
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
  },
  iconBtn: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#CBD5E1",
    borderWidth: 1,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
