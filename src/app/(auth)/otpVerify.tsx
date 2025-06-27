import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colourPalette from "../../theme/darkPaletter";
import RandomBackgroundImages from "../../components/RandomBGImage";
import ErrorAlert from "../../components/errorAlert";

const OtpVerificationUI = () => {
  const router = useRouter();
  const [error, setError] = useState<String>(
    "Incorrect OTP. Try again or request a new code"
  );
  const [otp, setOTP] = useState<string>();

  const handleVerify = () => {
    if (!otp || otp?.length < 4) {
      setError("Please Enter valid OTP");
      return;
    }
    router.replace("/profileSetup");
  };
  return (
    <RandomBackgroundImages style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo/logo2.png")}
          style={{ aspectRatio: 31 / 5, width: 248 }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          width: "110%",
          alignSelf: "center",
          top: 165,
        }}
      >
        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior="height"
        style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: 140,
        }}
      >
        <Text style={styles.mailText}>
          Enter the verification code sent to ***38
        </Text>

        <OtpInput
          secureTextEntry={false}
          numberOfDigits={4}
          focusStickBlinkingDuration={500}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
          }}
          onTextChange={(text) => setOTP(text)}
        />

        <TouchableOpacity style={styles.continueBtn} onPress={handleVerify}>
          <Text style={styles.continueText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendView}>
          <Text
            onPress={() => alert("OTP has resent on your mail ID")}
            style={[
              styles.resendText,
              {
                color: colourPalette.textSecondary,
              },
            ]}
          >
            Didn't receive an OTP?
          </Text>
          <TouchableOpacity
            onPress={() => alert("OTP has resent on your mail ID")}
          >
            <Text
              style={[
                styles.resendText,
                {
                  // color: "Black",
                  color: colourPalette.textPrimary,
                  fontFamily: "InterBold",
                },
              ]}
            >
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </RandomBackgroundImages>
  );
};

export default OtpVerificationUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 115,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  emailText: {
    color: colourPalette.textPrimary,
    fontSize: 32,
    fontFamily: "InterBold",
    textAlign: "center",
    marginBottom: 34,
  },
  mailText: {
    color: colourPalette.textSecondary,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Inter",
    marginBottom: 30,
  },
  otpContainer: {
    marginBottom: 10,
  },
  pinCodeContainer: {
    backgroundColor: "#ffffff4D",
    width: "18%",
    aspectRatio: 1,
  },
  pinCodeText: {
    color: colourPalette.inputText,
    fontSize: 32,
    fontFamily: "InterBold",
  },
  resendView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  resendText: {
    color: colourPalette.inputText,
    fontSize: 14,
    fontFamily: "Inter",
    marginLeft: 5,
  },
  continueBtn: {
    marginTop: 30,
    backgroundColor: colourPalette.buttonPrimary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  continueText: {
    color: "#000",
    fontFamily: "InterBold",
    fontSize: 16,
  },
});
