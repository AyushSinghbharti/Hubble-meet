// utils/requestAndSavePermission.ts
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type PermissionType = "contacts" | "photos";

const requestAndSavePermission = async (type: PermissionType): Promise<void> => {
    try {
        let permission: string | undefined;

        if (Platform.OS === "android") {
            if (type === "contacts") {
                permission = PERMISSIONS.ANDROID.READ_CONTACTS;
            } else if (type === "photos") {
                // Use READ_MEDIA_IMAGES for API 33+ if needed
                permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
            }
        } else if (Platform.OS === "ios") {
            if (type === "contacts") {
                permission = PERMISSIONS.IOS.CONTACTS;
            } else if (type === "photos") {
                permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
            }
        }

        if (!permission) {
            console.warn("Unsupported platform or permission type.");
            return;
        }

        const result = await request(permission);
        const granted = result === RESULTS.GRANTED ? "granted" : "denied";

        await AsyncStorage.setItem(`${type}Permission`, granted);
        console.log(`${type} permission: ${granted}`);
    } catch (error) {
        console.error(`Permission request failed for ${type}:`, error);
    }
};

export default requestAndSavePermission;
