import { Linking } from "react-native";
import { useEffect } from "react";

export default function DigiLockerHandler({ onResult }) {
    useEffect(() => {
        const handleDeepLink = (event) => {
            const url = event.url;
            console.log("Redirected from DigiLocker: ",url);

            const params = new URLSearchParams(url.split('?')[1]);
            const status = params.get('status');
            const verificationId = params.get('Verification_id');

            if(onResult) {
                onResult({ status, verificationId });
            }
        };

        Linking.addEventListener('url', handleDeepLink);
        Linking.getInitialURL().then((url) => {
            if(url) handleDeepLink({url});
        });

        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, []);

    return null;
}
