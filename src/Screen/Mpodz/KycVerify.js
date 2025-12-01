import React, { useContext, useState } from 'react';
import { View, Button, Alert, ActivityIndicator, Text } from 'react-native';
import { useDigiLocker } from '@cashfreepayments/react-native-digilocker';
import { MpodzContext } from './MpodzContex';

export default function  KycVerify() {
    const { verify } = useDigiLocker();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [documents, setDocuments] = useState(null);

    const {userDetails, userPhone} = useContext(MpodzContext);
    // console.log('User data: ',userDetails, userPhone);

    const checkDigiLockerAccount = async () => {
        try {
            const response = await fetch('https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/verifyAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // verification_id: 'UNIQUE_ID_12345', // Your unique identifier
                    // mobile: '9988777666', // OR
                    // aadhaar: '655675523712' // Either mobile or aadhaar
                    phoneNumber : '6307006215',
                    userId : 'f0c1eddf-4d47-4f6e-b762-a0b6283d5cf1'
                })
            });
            
            const data = await response.json();
            
            // Response fields:
            // - verification_id: Your unique ID
            // - reference_id: Cashfree's reference ID
            // - mobile: User's mobile number
            // - aadhaar: Masked Aadhaar (XXXXXXXX3712)
            // - status: "ACCOUNT_EXISTS" or "ACCOUNT_NOT_FOUND"
            // - digilocker_id: Unique DigiLocker ID (if exists)
            
            return data.status === 'ACCOUNT_EXISTS' ? 'signin' : 'signup';
        } catch (error) {
            console.error('Error verifying account:', error);
            return 'signup'; // Default to signup flow
        }
    };

    const generateDigiLockerUrl = async (userFlow, documentsRequired) => {
        try {
            const response = await fetch('https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/createDigiLockerURL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    document_requested: ["AADHAAR"],
                    // verification_id: 'UNIQUE_ID_12345',
                    user_id: "f0c1eddf-4d47-4f6e-b762-a0b6283d5cf1",
                    redirect_url: 'https://metropodz-v1.netlify.app/redirect',
                    user_flow: userFlow // 'signin' or 'signup'
                })
            });
            
            const data = await response.json();
            
            // Response fields:
            // - verification_id: Your unique ID
            // - reference_id: Cashfree's reference ID (important - store this!)
            // - url: DigiLocker consent URL (valid for 10 minutes)
            // - status: "PENDING"
            // - user_flow: "signin" or "signup"
            
            return {
                url: data.url,
                verificationId: data.verification_id,
                referenceId: data.reference_id
            };
        } catch (error) {
            console.error('Error generating URL:', error);
            throw error;
        }
    };


    const checkVerificationStatus = async (verificationId, referenceId) => {
        try {
            const response = await fetch(
                `https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/status?verification_id=${verificationId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );    
            const data = await response.json();
            
            // Response fields:
            // - user_details: { name, dob, gender, eaadhaar, mobile }
            // - status: "PENDING", "AUTHENTICATED", "EXPIRED", "CONSENT_DENIED"
            // - document_requested: ["AADHAAR", "PAN"]
            // - document_consent: ["AADHAAR"] (documents user consented to)
            // - verification_id: Your unique ID
            // - reference_id: Cashfree's reference ID
            
            console.log('Verification Status:', data.status);
            console.log('User Details:', data.user_details);
            console.log('Consented Documents:', data.document_consent);
            
            if (data.status === 'AUTHENTICATED') {
                // User authenticated and gave consent - now fetch documents
                await fetchDocuments(verificationId, referenceId, data.document_consent);
            } else if (data.status === 'PENDING') {
                // Still pending - wait and retry
                Alert.alert('Pending', 'Verification is still in progress.');
            } else if (data.status === 'EXPIRED') {
                Alert.alert('Expired', 'Verification link expired. Please try again.');
            } else if (data.status === 'CONSENT_DENIED') {
                Alert.alert('Denied', 'You denied document consent.');
            }
            
            return data;
        } catch (error) {
            console.error('Error checking status:', error);
            throw error;
        }
    };


    const fetchDocuments = async (verificationId, referenceId, documentConsent) => {
        try {
            const documents = {};
            
            // Fetch each consented document
            for (const docType of documentConsent) {
                const response = await fetch(
                    `https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/document`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            verification_id: verificationId,
                            reference_id: referenceId,
                            document_type: docType
                        })
                    }
                );
                const docData = await response.json();

                // Response fields (for AADHAAR example):
                // - parent_name: "John Snow"
                // - dob: "02-02-1995"
                // - gender: "M"
                // - name: "John Doe"
                // - year_of_birth: 2000
                // - photo: "Base64 encoded image"
                // - message: "Aadhaar Card Exists"
                // - reference_id: Cashfree's reference ID
                // - status: "SUCCESS" or "AADHAAR_NOT_LINKED"
                // - split_address: { country, dist, house, landmark, pincode, etc. }
                // - aadhaar_number: "xxxxxxxx5678" (masked)
                // - verification_id: Your unique ID
                // - zip_data_url: "URL to zip file (48hr expiry)"
                
                documents[docType] = docData;
                console.log(`${docType} Document:`, docData);
            }
            // Now you have all the verified documents
            // Store them in your app state or send to your backend
            return documents;
            
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    };




    const startFullVerificationFlow = async () => {
        setLoading(true);
        setStatus('Checking account...');
        
        try {
            // Step 1: Check if DigiLocker account exists (optional)
            const userFlow = await checkDigiLockerAccount();
            
            // Step 2: Generate DigiLocker URL
            setStatus('Generating verification link...');
            const { url, verificationId, referenceId } = await generateDigiLockerUrl(
                userFlow,
                ['AADHAAR']
            );
            
            setStatus('Opening DigiLocker...');
            
            // Step 3: Launch DigiLocker SDK
            verify(url, 'https://verification.cashfree.com/dgl/status', {
                userFlow: userFlow,
                onSuccess: async (data) => {
                    setStatus('Verification completed. Fetching status...');
                    
                    // Step 4: Check verification status
                    const statusData = await checkVerificationStatus(verificationId, referenceId);
                    
                    if (statusData.status === 'AUTHENTICATED') {
                        // Step 5: Fetch documents
                        setStatus('Fetching documents...');
                        const docs = await fetchDocuments(
                            verificationId,
                            referenceId,
                            statusData.document_consent
                        );
                        
                        setDocuments(docs);
                        setStatus('Complete!');
                        setLoading(false);
                        
                        Alert.alert('Success', 'Documents verified and retrieved!');
                    } else {
                        setLoading(false);
                        Alert.alert('Status', `Current status: ${statusData.status}`);
                    }
                },
                onError: (error) => {
                    setLoading(false);
                    setStatus('Error occurred');
                    Alert.alert('Error', error);
                },
                onCancel: () => {
                    setLoading(false);
                    setStatus('Cancelled');
                    Alert.alert('Cancelled', 'You cancelled the verification.');
                }
            });
        
        } catch (error) {
            setLoading(false);
            setStatus('Error occurred');
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button 
        title="Start DigiLocker Verification" 
        onPress={startFullVerificationFlow}
        disabled={loading}
      />
      
      {loading && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>{status}</Text>
        </View>
      )}
      
      {documents && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Documents Retrieved:</Text>
          <Text>{JSON.stringify(documents, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}
