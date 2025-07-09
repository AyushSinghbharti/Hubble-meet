import { useCallback, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

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
}

interface UseSocialAuthReturn {
    loading: boolean;
    error: unknown;
    signInWithGoogle: () => Promise<SocialUserPayload | null>;
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
        signOut,
    };
}
