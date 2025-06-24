import { StyleSheet } from "react-native";
import colourPalette from "../../../theme/darkPaletter";

export default StyleSheet;

export const loginStyles = StyleSheet.create({
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
    color: colourPalette.textPrimary,
    fontFamily: "InterBold",
    marginBottom: 40,
  },
  form: {
    width: "100%",
    paddingHorizontal: 16,
  },
  label: {
    color: colourPalette.textPrimary,
    fontFamily: "InterSemiBold",
    fontSize: 18,
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 40,
  },
  error: {
    color: colourPalette.errorText,
    fontFamily: "Inter",
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
    elevation: 5,
    shadowColor: colourPalette.textDescription,
  },
  flag: {
    width: 20,
    height: 14,
    marginRight: 5,
  },
  countryCode: {
    fontFamily: "InterSemiBold",
    color: colourPalette.textPrimary,
    marginRight: 8,
    marginLeft: 3,
  },
  phoneInput: {
    flex: 1,
    verticalAlign: "middle",
    color: colourPalette.textPrimary,
    fontSize: 15,
    fontFamily: "InterMedium",
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "white",
    backgroundColor: colourPalette.inputBackground,
    borderWidth: 1,
    borderColor: colourPalette.inputBorder,
  },
  loginBtn: {
    // backgroundColor: "#BBCF8D",
    backgroundColor: colourPalette.buttonPrimary,
    elevation: 5,
    shadowColor: "white",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 35,
  },
  loginText: {
    color: "#000",
    fontFamily: "InterBold",
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

  //Register styles
  logoAbsolute: {
    position: "absolute",
    top: 80,
    height: 40,
    width: 248,
  },
  emailContainer: {
    flexDirection: "row",
  },
  flagIcon: {
    width: 20,
    height: 14,
    marginRight: 5,
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
  orBold: {
    fontSize: 16,
    fontFamily: "InterBold",
  },
});