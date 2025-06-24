import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";
import colourPalette from "../../theme/darkPaletter";
import { loginStyles as styles } from "./Styles/Styles";
import { useRef, useState } from "react";
import SelectCountryModal from "../../components/selectCountryModal";

type Country = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

const FLAG_ICON = "https://flagcdn.com/w40/in.png";
const GOOGLE_ICON =
  "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png";
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

  const handleLogin = () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    router.push("/connect");
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/images/LoginPageBG.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={["transparent", "#000000CC", "#000"]}
        style={styles.container}
      >
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Login</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Phone number</Text>
          <View style={[{ marginBottom: error ? 20 : 40, gap: 4 }]}>
            <View style={[styles.phoneContainer, { marginBottom: 0 }]}>
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
                  <Text style={styles.countryCode}>
                    {selectedFlag.dial_code}
                  </Text>
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
                  {
                    borderColor: error
                      ? colourPalette.errorButton
                      : colourPalette.inputBorder,
                  },
                ]}
              />
            </View>
            {error && (
              <Text style={[styles.error, { marginBottom: 9, marginTop: 2 }]}>
                {error}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.loginBtn,
              {
                backgroundColor:
                  phoneNumber
                    ? colourPalette.buttonPrimary
                    : colourPalette.buttonPrimaryDisabled,
                borderColor:
                  phoneNumber
                    ? colourPalette.buttonPrimaryBorder
                    : colourPalette.buttonPrimaryBorderDisabled,
              },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <Link href={"./signup"} style={styles.signupText}>
          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </Link>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>
            Or <Text style={styles.bold}>Login</Text> with
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
      </LinearGradient>
    </ImageBackground>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//   },
//   logo: {
//     height: 40,
//     width: 248,
//     marginBottom: 185,
//   },
//   title: {
//     fontSize: 22,
//     color: colourPalette.textPrimary,
//     fontFamily: "InterBold",
//     marginBottom: 40,
//   },
//   inputWrapper: {
//     width: "100%",
//     paddingHorizontal: 16,
//   },
//   label: {
//     color: colourPalette.textPrimary,
//     fontFamily: "InterSemiBold",
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   phoneContainer: {
//     flexDirection: "row",
//     borderRadius: 10,
//     marginBottom: 40,
//   },
//   error: {
//     color: colourPalette.errorText,
//     fontFamily: "Inter",
//   },
//   flagBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     // backgroundColor: "#fff",
//     backgroundColor: colourPalette.inputBackground,
//     borderColor: colourPalette.inputBorder,
//     borderWidth: 1,
//     borderRadius: 8,
//     marginRight: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     elevation: 5,
//     shadowColor: colourPalette.textDescription,
//   },
//   flag: {
//     width: 20,
//     height: 14,
//     marginRight: 5,
//   },
//   countryCode: {
//     fontFamily: "InterSemiBold",
//     color: colourPalette.textPrimary,
//     marginRight: 8,
//     marginLeft: 3,
//   },
//   phoneInput: {
//     flex: 1,
//     verticalAlign: "middle",
//     // color: "grey",
//     color: colourPalette.textPrimary,
//     fontSize: 15,
//     fontFamily: "InterMedium",
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     // backgroundColor: "#fff",
//     elevation: 5,
//     shadowColor: "white",
//     backgroundColor: colourPalette.inputBackground,
//     borderWidth: 1,
//     borderColor: colourPalette.inputBorder,
//   },
//   loginBtn: {
//     // backgroundColor: "#BBCF8D",
//     backgroundColor: colourPalette.buttonPrimary,
//     elevation: 5,
//     shadowColor: "white",
//     borderWidth: 1,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 35,
//   },
//   loginText: {
//     color: "#000",
//     fontFamily: "InterBold",
//     fontSize: 18,
//   },
//   signupText: {
//     color: "#fff",
//     textAlign: "center",
//     marginBottom: 35,
//   },
//   signupLink: {
//     fontWeight: "bold",
//   },
//   orContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   orText: {
//     color: "white",
//     fontSize: 14,
//   },
//   bold: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "white",
//     marginHorizontal: 16,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     gap: 16,
//   },
//   iconBtn: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 50,
//     width: 50,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     resizeMode: "contain",
//   },
// });
