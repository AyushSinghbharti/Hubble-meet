import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { Ionicons } from "@expo/vector-icons";
import { useVerifyOTP, useResendOTP } from "../../hooks/useAuth";
import colourPalette from "@/src/theme/darkPaletter";
import { FONT } from "@/assets/constants/fonts";
import { ActivityIndicator } from "react-native-paper";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface OtpModalProps {
  visible: boolean;
  onClose: () => void;
  phone: string;
  type: "login" | "signup";
  maskedPhone?: string;
  selectedFlag: any;
}

const OtpModal: React.FC<OtpModalProps> = ({
  visible,
  onClose,
  phone,
  selectedFlag,
  type,
  maskedPhone = "***38",
}) => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [otp, setOTP] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [timerExpired, setTimerExpired] = useState(false);
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  const { mutate: resendOTP } = useResendOTP();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer when modal becomes visible
  useEffect(() => {
    if (visible) {
      startTimer();
    } else {
      // Clear timer when modal is closed
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible]);

  // Start countdown timer
  const startTimer = () => {
    setRemainingTime(30);
    setTimerExpired(false);

    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          setTimerExpired(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    handleVerify();
  }, [otp]);

  const handleVerify = () => {
    if (!otp || otp?.length < 4) {
      return;
    }

    const phoneNumber = selectedFlag.dial_code + phone;

    verifyOTP(
      { phone: phoneNumber, otp: otp },
      {
        onSuccess: (res) => {
          setOTP("");
          setError(null);
          setIsSuccess(true);
          // Clear timer on successful verification
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        },
        onError: (err: any) => {
          console.log(err?.response?.data?.message);
          setError(
            err?.response?.data?.message ||
              "Verification failed. Please try again"
          );
        },
      }
    );
  };

  const handleResendOTP = () => {
    const phoneNumber = selectedFlag.dial_code + phone;

    resendOTP(
      { phone: phoneNumber },
      {
        onSuccess: (res) => {
          setError(null);
          startTimer();
          setMessage("OTP sent successfully");
          setTimeout(() => setMessage(null), 3000);
        },
        onError: (err: any) => {
          console.log(err);
          setError(
            err?.response?.data?.message ||
              "Failed to resend OTP. Please try again"
          );
        },
      }
    );
  };

  const handleClose = () => {
    setOTP("");
    setError(null);
    setIsSuccess(false);
    setTimerExpired(false);
    setRemainingTime(30);

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    onClose();
  };

  // Format time display
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={10}
        style={styles.overlay}
      >
        {/* Bottom OTP Section */}
        <View style={styles.bottomSection}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <View style={styles.closeButtonCircle}>
              <Ionicons name="close" size={24} color="#000" />
            </View>
          </TouchableOpacity>
          {/* Message Icon */}
          <View style={styles.messageIconContainer}>
            <Image
              source={require("../../../assets/icons/message.png")}
              style={{ height: 45, width: 45 }}
            />
          </View>

          {/* OTP Content */}
          <View style={styles.otpContent}>
            <Text style={styles.instructionText}>
              Enter the verification code sent to{" "}
              <Text style={{ fontSize: 16, fontFamily: FONT.SEMIBOLD }}>
                {maskedPhone}
              </Text>
            </Text>
            <OtpInput
              secureTextEntry={false}
              numberOfDigits={4}
              focusStickBlinkingDuration={500}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: [
                  styles.pinCodeContainer,
                  error && styles.pinCodeErrorBorder,
                  isSuccess && styles.pinCodeSuccessBorder,
                ],
                pinCodeTextStyle: styles.pinCodeText,
              }}
              onTextChange={(text) => setOTP(text)}
              autoFocus={true}
            />
            {error && <Text style={styles.inlineErrorText}>{error}</Text>}
            {message && <Text style={styles.inlineMessageText}>{message}</Text>}
            {/* Bottom Row with Timer and Auto Capturing */}
            <View style={styles.bottomRow}>
              {timerExpired ? (
                <>
                  <Text
                    style={[styles.resendText, { textDecorationLine: "none" }]}
                  >
                    Didn't receive an OTP?
                  </Text>
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text style={styles.resendText}>Resend</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.timerText}>
                    Remaining time: {formatTime(remainingTime)}
                  </Text>
                  <View style={styles.autoCapturingContainer}>
                    <View style={styles.autoCapturingDot}>
                      <ActivityIndicator size={12} color="#4A90E2" />
                    </View>
                    <Text style={styles.autoCapturingText}>Auto capturing</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default OtpModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  closeButton: {
    position: "absolute",
    top: -60,
    left: "50%",
    zIndex: 1000,
  },
  closeButtonCircle: {
    width: 45,
    height: 45,
    elevation: 10,
    borderRadius: "100%",
    backgroundColor: colourPalette.buttonPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    position: "relative",
  },
  messageIconContainer: {
    alignSelf: "center",
    marginVertical: 5,
    marginBottom: 20,
  },
  otpContent: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  bottomRow: {
    // marginTop: height * 0.115,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Inter",
  },
  otpContainer: {
    marginBottom: 25,
    justifyContent: "space-around",
  },
  pinCodeContainer: {
    backgroundColor: "#333333",
    borderWidth: 1,
    borderColor: "#444444",
    borderRadius: 8,
    width: 60,
    height: 60,
    marginHorizontal: 8,
  },
  pinCodeText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "InterBold",
  },
  timerText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Inter",
  },
  autoCapturingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  autoCapturingDot: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  autoCapturingText: {
    color: "#4A90E2",
    fontSize: 14,
    fontFamily: "Inter",
  },
  pinCodeErrorBorder: {
    borderColor: "red",
  },
  inlineErrorText: {
    color: "red",
    marginTop: -20,
    marginBottom: 25,
    fontFamily: "Inter",
    fontSize: 13,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  inlineMessageText: {
    color: "#BBCF8D",
    marginTop: -20,
    marginBottom: 25,
    fontFamily: FONT.ITALICMEDIUM,
    fontSize: 13,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  resendText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  pinCodeSuccessBorder: {
    borderColor: "#a5ff76",
  },
});
