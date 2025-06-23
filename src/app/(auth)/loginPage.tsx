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
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
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

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedFlag, setSelectedFlag] = useState<Country>({
    code: "IN",
    name: "India",
    dial_code: "+91",
    flag: "https://flagcdn.com/w2560/in.png",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [flagBoxPosition, setFlagBoxPosition] = useState({ x: 0, y: 0 });
  const flagBoxRef = useRef<View>(null);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Phone number</Text>
        <View style={styles.phoneContainer}>
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
            style={styles.phoneInput}
          />
        </View>

        <Link
          href={"/connect"}
          style={[
            styles.loginBtn,
            {
              backgroundColor: phoneNumber
                ? colourPalette.buttonSecondary
                : colourPalette.buttonSecondaryDisabled,
              borderColor: phoneNumber
                ? colourPalette.buttonSecondaryBorder
                : colourPalette.buttonSecondaryBorderDisabled,
              textAlign: "center",
            },
          ]}
        >
          <Text style={styles.loginText}>Log in</Text>
        </Link>
      </View>

      <Link href={"/signup"} style={styles.signupText}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </Link>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>
          Or <Text style={styles.orBold}>Login</Text> with
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
    fontSize: 22,
    color: colourPalette.textPrimary,
    fontFamily: "InterBold",
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
    fontFamily: "InterMedium",
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  flagBox: {
    flexDirection: "row",
    alignItems: "center",
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
    color: colourPalette.textSecondary,
    fontFamily: "Inter",
    marginLeft: 3,
    fontWeight: "600",
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    color: colourPalette.textSecondary,
    backgroundColor: colourPalette.inputBackground,
    borderColor: colourPalette.inputBorder,
    // borderColor: "#CBD5E1",
    fontFamily: "Inter",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  loginBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 35,
    borderWidth: 1,
  },
  loginText: {
    color: colourPalette.textPrimary,
    fontSize: 18,
    fontFamily: "InterBold",
  },
  signupText: {
    color: colourPalette.textPrimary,
    fontFamily: "Inter",
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
    fontFamily: "Inter",
    fontSize: 14,
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
