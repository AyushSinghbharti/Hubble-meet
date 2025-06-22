import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const OtpVerificationUI = () => {
  const router = useRouter();
  const [error, setError] = useState<String>(
    "Incorrect OTP. Try again or request a new code"
  );
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ aspectRatio: 31 / 5, width: 148 }}
        />
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <Text style={styles.emailText}>OTP Verification</Text>
      <Text style={styles.mailText}>
        Enter the verification code sent to ***38
      </Text>

      <OtpInput
        numberOfDigits={4}
        focusColor="gray"
        focusStickBlinkingDuration={500}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
        }}
      />

      {error && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "red", fontSize: 14, fontFamily: "Inter" }}>
            {error}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.continueBtn} onPress={() => useRouter().replace("/profileSetup")}>
        <Text style={styles.continueText}>Verify</Text>
      </TouchableOpacity>
      {error && (
        <View style={styles.resendView}>
          <Text style={[styles.resendText, { color: "#878787" }]}>
            Didn't receive code?
          </Text>
          <TouchableOpacity>
            <Text
              style={[
                styles.resendText,
                { color: "Black", fontFamily: "InterBold" },
              ]}
            >
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OtpVerificationUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 64,
  },
  emailText: {
    fontSize: 32,
    // fontWeight: 'bold',
    fontFamily: "InterBold",
    textAlign: "center",
    marginBottom: 34,
  },
  mailText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Inter",
    marginBottom: 30,
  },
  otpContainer: {
    marginBottom: 10,
  },
  pinCodeContainer: {
    backgroundColor: "#EAEAEA",
    width: "18%",
    aspectRatio: 1,
  },
  pinCodeText: {
    color: "#101010",
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
    fontSize: 14,
    fontFamily: "Inter",
    marginLeft: 5,
  },
  continueBtn: {
    marginTop: 30,
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
