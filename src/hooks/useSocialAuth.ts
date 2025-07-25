import { useCallback, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * Shape returned by the hook & sent to `/api/auth/social-login`.
 */
export interface SocialUserPayload {
    providerId: "google" | "apple" | "facebook";
    email: string;
    data: any;
    phoneNumber: string | null;
    displayName: string | null;
    photoURL: string | null;
    /** Raw ID‑token from provider – if you want to verify it on the backend */
    idToken: string;
    user: {
        photo: string;
        name: string;
        id: string;
        email: string;
    }
}

interface UseSocialAuthReturn {
    loading: boolean;
    error: unknown;
    signInWithGoogle: () => Promise<SocialUserPayload | null>;
    signInWithApple: () => Promise<SocialUserPayload | null>;
    signOut: () => Promise<void>;
}

export function useSocialAuth(): UseSocialAuthReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const signInWithGoogle = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            await GoogleSignin.signOut();
            // Ensure Play Services are available (android only)
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Start Google native auth flow
            //   const { idToken, user } = await GoogleSignin.signIn();
            const signInResult = await GoogleSignin.signIn();
            // console.log(signInResult);
            let idToken = signInResult.data?.idToken;

            if (!idToken) {
                throw new Error("Google Sign‑In returned no idToken");
            }

            // Upgrade Google credential → Firebase credential
            const credential = auth.GoogleAuthProvider.credential(idToken);
            const firebaseUser = (await auth().signInWithCredential(credential)).user;

            // Build the payload expected by your backend
            return {
                providerId: "google" as const,
                data: signInResult.data,
                email: firebaseUser.email ?? "",
                phoneNumber: firebaseUser.phoneNumber,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                idToken,
            } satisfies SocialUserPayload;
        } catch (e: any) {
            // Ignore user cancellation
            if (e?.code === statusCodes.SIGN_IN_CANCELLED) return null;
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const signInWithApple = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const isAvailable = await AppleAuthentication.isAvailableAsync();
            if (!isAvailable) {
                throw new Error("Apple Sign-In is not available on this device");
            }

            const appleAuthRequest = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            console.log("Apple Sign-In Success:", JSON.stringify(appleAuthRequest, null, 2));

            const { identityToken, email, fullName, user: appleUserId } = appleAuthRequest;

            if (!identityToken) {
                throw new Error("Apple Sign-In returned no identityToken");
            }

            const credential = auth.AppleAuthProvider.credential(identityToken);
            const firebaseUser = (await auth().signInWithCredential(credential)).user;

            return {
                providerId: "apple" as const,
                data: appleAuthRequest,
                email: firebaseUser.email ?? email ?? "",
                phoneNumber: firebaseUser.phoneNumber,
                displayName:
                    firebaseUser.displayName ??
                    `${fullName?.givenName ?? ""} ${fullName?.familyName ?? ""}`.trim(),
                photoURL: firebaseUser.photoURL,
                idToken: identityToken,
                user: {
                    photo: firebaseUser.photoURL ?? "",
                    name:
                        firebaseUser.displayName ??
                        `${fullName?.givenName ?? ""} ${fullName?.familyName ?? ""}`.trim(),
                    id: firebaseUser.uid,
                    email: firebaseUser.email ?? email ?? "",
                },
            } satisfies SocialUserPayload;
        } catch (e: any) {
            console.error("Apple Sign-In Error:", e);
            if (e.code === "ERR_CANCELED") return null;
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);


    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            await GoogleSignin.signOut();
            await auth().signOut();
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        signInWithGoogle,
        signInWithApple,
        signOut,
    };
}
