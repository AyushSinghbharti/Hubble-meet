import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FONT } from "@/assets/constants/fonts";
import colourPalette from "@/src/theme/darkPaletter";
const { width, height } = Dimensions.get("window");

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert("QR Code Scanned", `Type: ${type}\nData: ${data}`, [
      {
        text: "Scan Again",
        onPress: () => setScanned(false),
      },
      {
        text: "OK",
        style: "default",
      },
    ]);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Ionicons
            name="camera-outline"
            size={48}
            color={colourPalette.iconInactive}
          />
          <Text style={styles.loadingText}>
            Requesting camera permission...
          </Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Ionicons
            name="camera-off-outline"
            size={64}
            color={colourPalette.errorText}
          />
          <Text style={styles.errorTitle}>Camera Access Denied</Text>
          <Text style={styles.errorDescription}>
            Please enable camera permissions to scan QR codes
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colourPalette.backgroundPrimary}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colourPalette.iconActive}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Scanner</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Camera View */}
      <View style={styles.cameraWrapper}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
        />

        {/* Scanning Overlay */}
        <View style={styles.scannerOverlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlayLeft} />
            <View style={styles.scanFrame}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {/* Scanning animation line */}
              {!scanned && <View style={styles.scanLine} />}
            </View>
            <View style={styles.overlayRight} />
          </View>
          <View style={styles.overlayBottom} />
        </View>

        {/* Success indicator */}
        {scanned && (
          <View style={styles.successOverlay}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={colourPalette.success}
              />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Ionicons
              name="scan-outline"
              size={20}
              color={colourPalette.backgroundPrimary}
            />
            <Text style={styles.scanAgainText}>Scan Another</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colourPalette.backgroundPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colourPalette.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colourPalette.borderColor,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colourPalette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONT.MONSERRATSEMIBOLD,
    color: colourPalette.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  cameraWrapper: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: colourPalette.overlay,
  },
  overlayMiddle: {
    flexDirection: "row",
    height: 250,
  },
  overlayLeft: {
    flex: 1,
    backgroundColor: colourPalette.overlay,
  },
  overlayRight: {
    flex: 1,
    backgroundColor: colourPalette.overlay,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: colourPalette.overlay,
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: colourPalette.buttonPrimary,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: colourPalette.buttonPrimary,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: colourPalette.buttonPrimary,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: colourPalette.buttonPrimary,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colourPalette.buttonPrimary,
    top: "50%",
    opacity: 0.8,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  successIcon: {
    backgroundColor: colourPalette.backgroundSecondary,
    borderRadius: 50,
    padding: 20,
    borderWidth: 2,
    borderColor: colourPalette.success,
  },
  bottomSection: {
    backgroundColor: colourPalette.backgroundSecondary,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 60,
    borderTopWidth: 1,
    borderTopColor: colourPalette.borderColor,
  },
  instructionCard: {
    backgroundColor: colourPalette.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colourPalette.borderColor,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: FONT.MONSERRATSEMIBOLD,
    color: colourPalette.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    fontFamily: FONT.MONSERRATREGULAR,
    color: colourPalette.textDescription,
    textAlign: "center",
    lineHeight: 20,
  },
  scanAgainButton: {
    backgroundColor: colourPalette.buttonPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanAgainText: {
    fontSize: 16,
    fontFamily: FONT.MONSERRATSEMIBOLD,
    color: colourPalette.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colourPalette.backgroundPrimary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingCard: {
    backgroundColor: colourPalette.surface,
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colourPalette.borderColor,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONT.MONSERRATMEDIUM,
    color: colourPalette.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colourPalette.backgroundPrimary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorCard: {
    backgroundColor: colourPalette.surface,
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colourPalette.borderColor,
    maxWidth: 300,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: FONT.MONSERRATSEMIBOLD,
    color: colourPalette.textPrimary,
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 14,
    fontFamily: FONT.MONSERRATREGULAR,
    color: colourPalette.textDescription,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: colourPalette.buttonSecondary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: FONT.MONSERRATSEMIBOLD,
    color: colourPalette.textPrimary,
  },
});
