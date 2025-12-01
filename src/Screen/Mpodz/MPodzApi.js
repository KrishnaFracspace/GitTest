import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// export const Registration

export const GenerateQrCode = async payload => {
    return await axios.post(
        'https://apitest.fracspace.com/api/users/generateQRCode',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const Registration = async payload => {
    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/auth/register',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const SendLoginOtp = async payload => {
    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/auth/sendLoginOTP',
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'Fracspace@2024'
            },
        },
    );
};

export const VerifyLoginOtp = async payload => {
    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/auth/verifyLoginOTP',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const GetPodz = async payload => {
    return await axios.get(
        'https://metropodz-mvp.onrender.com/api/v1/pods',
        {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'Fracspace@2024'
            },
        },
    );
};


export const BookPodz = async payload => {
    const token = await AsyncStorage.getItem('authToken');

    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/bookings/',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`
            },
        },
    );
};

export const UploadAdahaar = async payload => {
    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/kyc/aadhaarMasking',
        payload,
        {
            headers:{
                'Content-Type' : 'multipart/form-data',
                'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


export const VerifyAccount = async payload => {
    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/verifyAccount',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                // 'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};


export const GenerateDigiUrl = async payload => {
    return await axios.post(
        'https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/createDigiLockerURL',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
                // 'x-api-key' : 'Fracspace@2024'
            },
        },
    );
};

export const GetDigiStatus = async payload => {
    return await axios.get(
        'https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/status?verification_id=DIGILOCKER_1759126822531_BJ08PQ',
        payload,
        {
            headers: {
                'Content-Type' : 'application/json',
            },
        },
    );
};

export const GetDigiDoc = async payload => {
    return await axios.post(
        "https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/document",
        payload,
        {
            headers: {
                'Content-Type' : 'applications/json',
                // 'x-api-key' : 'Fracspace@2024'
            }
        }
    )
}