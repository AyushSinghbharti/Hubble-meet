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

const FLAG_ICON = "https://flagcdn.com/w40/in.png";
const GOOGLE_ICON = "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png";
const FACEBOOK_ICON = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy0dDdi3KJgMq_87aJt9us_0yh69ewaKgUzg&s";

const IconButton = ({ children, image }: { children?: React.ReactNode; image?: string }) => (
  <TouchableOpacity style={styles.iconBtn}>
    {image ? <Image source={{ uri: image }} style={styles.icon} /> : children}
  </TouchableOpacity>
);

export default function Login() {
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/images/LoginPageBG.jpg")}
      style={styles.container}
    >
      <LinearGradient colors={["transparent", "#000000CC", "#000"]} style={styles.container}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Login</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Phone number</Text>

          <View style={styles.phoneContainer}>
            <View style={styles.flagBox}>
              <Image source={{ uri: FLAG_ICON }} style={styles.flag} />
              <Text style={styles.countryCode}>+91</Text>
              <FontAwesome name="chevron-down" size={12} color="#656565" />
            </View>

            <TextInput
              placeholder="Phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              style={styles.phoneInput}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>

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
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    height: 40,
    width: 248,
    marginBottom: 185,
  },
  title: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    marginBottom: 40,
  },
  inputWrapper: {
    width: "100%",
    paddingHorizontal: 16,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 40,
  },
  flagBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  flag: {
    width: 20,
    height: 14,
    marginRight: 5,
  },
  countryCode: {
    fontWeight: "600",
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    color: "#000",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  loginBtn: {
    backgroundColor: "#BBCF8D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 35,
  },
  loginText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },
  signupText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 35,
  },
  signupLink: {
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  orText: {
    color: "white",
    fontSize: 14,
  },
  bold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  iconBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
