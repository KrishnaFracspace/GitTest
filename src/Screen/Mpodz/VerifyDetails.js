import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, TextInput, Linking, ActivityIndicator, ScrollView } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { GenerateDigiUrl, GenerateQrCode, GetDigiDoc, GetDigiStatus, VerifyAccount } from "./MPodzApi";
import { MpodzContext } from "./MpodzContex";

export default function VerifyDetails({route}) {
    // console.log('userData: ',props?.route?.params?.userData);
    // const userData = route?.params?.userData;
    // const [bookingData, setBookingData] = useState(props?.route?.params?.userData);

    // const { verificationId, referenceId } = route.params || {};

    const { bookingData, setReferenceId, setVerificationId} = useContext(MpodzContext);

    const [imageUri, setImageUri] = useState(null);
    const [docUri, setDocUri] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const device = useCameraDevice("front");
    const deviceBack = useCameraDevice("back");
    const cameraRef = useRef(null);
    const cameraDocRef = useRef(null);
    const [selectDoc, setSelectDoc] = useState('Selfie');
    const {width, height} = Dimensions.get('window');
    const navigation = useNavigation();
    const inputRefs = useRef([]);
    const [adhaarNum, setAdhaarNum] = useState(['', '', '', '', '', '', '', '', '', '', '', '']);
    const [digiUrl, setDigiUrl] = useState(null);
    const [qrData, setQrData] = useState({});

    const [loading, setLoading] = useState(false);
    const [aadhaarData, setAadhaarData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            // console.log("Camera permission status:", status);

            if (status === "granted") {
                setHasPermission(true);
            } else {
                setHasPermission(false);
            }
        })();

        handleGenerateQr();
    }, []);

//     useEffect(() => {
//     const fetchDigiData = async () => {
//       if (!verificationId || !referenceId) return;

//       setLoading(true);
//       setError(null);

//       try {
//         // Step 1: Check DigiLocker status
//         const digiStatus = await GetDigiStatus(verificationId);
//         console.log("Digi Status:", digiStatus);

//         if (digiStatus?.status === "COMPLETED") {
//           // Step 2: Fetch Aadhaar document
//           const doc = await GetDigiDoc({
//             verification_id: verificationId,
//             reference_id: referenceId,
//             document_type: "AADHAAR",
//           });
//           console.log("DigiLocker Document:", doc);
//           setAadhaarData(doc);
//         } else {
//           setError("DigiLocker verification not completed.");
//         }
//       } catch (err) {
//         console.error("Error fetching DigiLocker data:", err);
//         setError("Something went wrong while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDigiData();
//   }, [verificationId, referenceId]);

    // useEffect(() => {
    //     const fetchDigiData = async () => {
    //         if (!verificationId || !referenceId) return;

    //         setLoading(true);
    //         setError(null);

    //         try {
    //             // Step 1: Check DigiLocker status
    //             const digiStatus = await GetDigiStatus(verificationId);
    //             console.log("Digi Status:", digiStatus);

    //             if (digiStatus?.status === "COMPLETED") {
    //                 // Step 2: Fetch Aadhaar document
    //                 const doc = await GetDigiDoc({
    //                     verification_id: verificationId,
    //                     reference_id: referenceId,
    //                     document_type: "AADHAAR",
    //                 });
    //                 console.log("DigiLocker Document:", doc);
    //                 setAadhaarData(doc);
    //             } else {
    //                 setError("DigiLocker verification not completed.");
    //             }
    //         } catch (err) {
    //             console.error("Error fetching DigiLocker data:", err);
    //             setError("Something went wrong while fetching data.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchDigiData();
    // }, [verificationId, referenceId]);


    // UI rendering
    //   if (loading) {
    //     return (
    //       <View style={styles.center}>
    //         <ActivityIndicator size="large" color="#007AFF" />
    //         <Text>Fetching DigiLocker KYC details...</Text>
    //       </View>
    //     );
    //   }

    //   if (error) {
    //     return (
    //       <View style={styles.center}>
    //         <Text style={{ color: "red" }}>{error}</Text>
    //       </View>
    //     );
    //   }

    //   if (!aadhaarData) {
    //     return (
    //       <View style={styles.center}>
    //         <Text>No KYC data available.</Text>
    //       </View>
    //     );
    //   }

    const handleChange = (text, index) => {
        const updateAdhaar = [...adhaarNum];
        updateAdhaar[index] = text;
        setAdhaarNum(updateAdhaar);

        if (text.length === 4 && index < 2) {
            // move to next input if current box is full
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && adhaarNum[index] === '') {
            if (index > 0) {
                // move back to previous input
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleGenerateQr = async () => {
        let payload = JSON.stringify({
            guestName: bookingData.name,
            roomNumber: '101',
            validFrom: bookingData.checkIn,
            validUntil: bookingData.checkOut
        })
        console.log("Payload: ",payload);

        try{
            let {data: res} = await GenerateQrCode(payload);
            const data = res.data;
            console.log('Response: ',data);
            // return data;
            setQrData(data);
        } catch(error) {
            console.error("Error in Generating Qr: ",error.response?.data || error.message);
        }
    };

    const handleVerify = async () => {
        let payload = JSON.stringify({
            phoneNumber : '6307006214',
            userId : 'f0c1eddf-4d47-4f6e-b762-a0b6283d5cf1'
        })
        console.log('Payload', payload);
        try {
            let {data : res} = await VerifyAccount(payload);
            const data = res;
            console.log('Response : ',res);
        }catch(error) {
            console.error("Error in Verifying Account Details:" ,error.response?.data || error.message);
        }
    };

    const genetateDigiUrl = async() => {
        let payload = {
            document_requested: ["AADHAAR"],
            user_id: "f0c1eddf-4d47-4f6e-b762-a0b6283d5cf1",
            redirect_url: "https://metropodz-v1.netlify.app/redirect",
            user_flow: "signup"
        };
        
        try {
            const { data: res } = await GenerateDigiUrl(payload);
            console.log("URL Response:", res);
            setReferenceId(res?.data?.reference_id);
            setVerificationId(res?.data?.verification_id);
            Linking.openURL(res.data.url); // or whatever Cashfree returns
        } catch (error) {
            console.error("Error in getting digi url:", error.response?.data || error.message);
        }
    };

    const getDigiStatus = async (verificationId) => {
        try {
            let { data: res } = await GetDigiStatus(verificationId); // pass ID to backend
            console.log('Response DigiStatus: ', res);
            return res;
        } catch (error) {
            console.error('Error in getting Digi Status: ', error.response?.data || error.message);
            return null;
        }
    };

    const getDigiDocument = async (verificationId, referenceId, docType = "AADHAAR") => {
        let payload = {
            verification_id: verificationId,
            reference_id: referenceId,
            document_type: docType
        };
        console.log("Payload: ", payload);

        try {
            let { data: res } = await GetDigiDoc(payload); // send payload to backend
            console.log('Response Digi Doc: ', res);
            return res;
        } catch (error) {
            console.error('Error in getting Digi Doc: ', error.response?.data || error.message);
            return null;
        }
    };

    // capture selfie
    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePhoto({
                qualityPrioritization: "quality",
            });
            setImageUri("file://" + photo.path);
        }
    };

    // capture adhaar
    const takeDocPic = async () => {
        // console.log("Fiel")
        if(cameraDocRef.current) {
            const photo = await cameraDocRef.current.takePhoto({
                qualityPrioritization: "quality",
            });
            // console.log("File:", photo)
            setDocUri("file://" + photo.path);
        }
    };

    // pick image from gallery
    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: "photo" });
        if (!result.didCancel && result.assets && result.assets[0].uri) {
            setImageUri(result.assets[0].uri);
        }
    };

    // pick adhaar from gallery
    const pickDoc = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if(!result.didCancel && result.assets && result.assets[0].uri) {
            setDocUri(result.assets[0].uri);
        }
    }

    // const verify = async () => {
    //     if(imageUri == null || docUri == null){
    //         Alert.alert("Alert", "Upload Selfie and Adhaar/PAN to continue.")
    //     } else {
    //         // const data = await handleGenerateQr();
    //         // navigation.navigate('BookingConfirm', {qrData: data});
    //         const data = await handleVerify();
    //         if(data.data.status == 'ACCOUNT_EXISTS'){
    //             genetateDigiUrl();
    //         }
    //     }
    // }

    const verify = async () => {
        const data = await handleVerify();
        // if(data.data.status == 'ACCOUNT_EXISTS'){
            genetateDigiUrl();
        // }
    }

    if (!device) {
        return (
            <View style={{flex: 1,backgroundColor: "#fafafa",alignItems: "center",paddingTop: 40,}}>
                <Text>No camera device found</Text>
            </View>
        );
    }
    if (!hasPermission) {
        return (
            <View style={{flex: 1,backgroundColor: "#fafafa",alignItems: "center",paddingTop: 40,}}>
                <Text>Waiting for camera permission...</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1,backgroundColor: "#fafafa",justifyContent:'space-between'}}>
            <View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('MPodzHome');
                    }} style={{width:25,height:25,borderRadius:15,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}}>
                        <Icon name={'chevron-left'} size={20} color={'#FFF'}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily:'Poppins-SemiBold',fontSize:20,color:'#000'}}>Verify Details</Text>
                    <View style={{width:25}}></View>
                </View>

                <View style={{alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',marginBottom:30}}>
                    <TouchableOpacity onPress={() => {
                        setSelectDoc('Selfie');
                    }} style={{borderBottomWidth:selectDoc === 'Selfie'?2:0}}>
                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:15,color:'#000'}}>Selfie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setSelectDoc('Adhaar');
                    }} style={{borderBottomWidth:selectDoc === 'Adhaar'?2:0}}>
                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:15,color:'#000'}}>PAN / Adhaar</Text>
                    </TouchableOpacity>
                </View>

                {selectDoc === 'Selfie' ?
                    <View>
                        {/* Camera preview OR selected image */}
                        <View style={{width: 250,height: 250,borderRadius:20,overflow: "hidden",marginVertical: 10,alignSelf:'center'}}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={{flex:1}} />
                                ) : (
                                <Camera
                                    ref={cameraRef}
                                    style={{flex:1}}
                                    device={device}
                                    isActive={true}
                                    photo={true}
                                />
                            )}
                        </View>

                        {/* Capture selfie */}
                        {!imageUri && (
                            <TouchableOpacity style={{backgroundColor: "#007AFF",padding: 12,borderRadius: 8,alignItems:'center',margin: 15,marginHorizontal:60}} onPress={takePicture}>
                                <Text style={{fontFamily:'Poppins-Medium',fontSize:15, color: "#fff" }}>Take Selfie</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    :
                    <View>
                        <View style={{width:250,height:250,borderRadius:20,overflow:'hidden',marginVertical:15,alignSelf:'center',}}>
                            {docUri ? (
                                <Image source={{uri : docUri}} style={{flex:1}}/>
                                ) : (
                                    <Camera
                                        ref={cameraDocRef}
                                        style={{flex:1}}
                                        device={deviceBack}
                                        isActive={true}
                                        photo={true}
                                    />
                                )
                            }
                        </View>

                        {!docUri && (
                            <TouchableOpacity onPress={takeDocPic} style={{backgroundColor:'#007aFF',padding:12,borderRadius:8,alignItems:'center',margin:15,marginHorizontal:60}} >
                                <Text style={{fontFamily:'Poppins-Medium',fontSize:15,color:'#fff'}}>Take Picture</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            </View>

            <View style={{marginBottom:height*0.2}}>
                <TouchableOpacity onPress={() => {
                    if(selectDoc === 'Selfie'){
                        pickImage();
                    }else{
                        pickDoc();
                    }
                }} style={{borderWidth: 1,padding:12,margin:40,borderColor: "#ccc",borderRadius: 10,justifyContent: "space-between",flexDirection:'row',alignItems: "center",marginBottom: 15,}} >
                    <Text style={{fontFamily:'Poppins-Regular',fontSize:16,color:'#00000099'}}>Upload Image</Text>
                    <Ico name={'image'} size={30} color={'#000'}/>
                </TouchableOpacity>

                {/* {selectDoc == 'Adhaar' &&
                    <View style={{padding:20}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:15,color:'#000'}}>Adhaar Number</Text>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',marginTop:10}}>
                            {[0,1,2].map((item, index) => (
                                <View key={index} style={{borderColor:'#000',borderWidth:0.5,borderRadius:10,width:80,paddingHorizontal:5}}>
                                    <TextInput
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        value={adhaarNum[index]}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',letterSpacing:10}}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                } */}

                {aadhaarData &&
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.heading}>Aadhaar Details</Text>
                        <Text><Text style={styles.label}>Name: </Text>{aadhaarData.name}</Text>
                        <Text><Text style={styles.label}>DOB: </Text>{aadhaarData.dob}</Text>
                        <Text><Text style={styles.label}>Gender: </Text>{aadhaarData.gender}</Text>
                        <Text><Text style={styles.label}>Aadhaar Number: </Text>{aadhaarData.aadhaar_number}</Text>
                        <Text><Text style={styles.label}>Address: </Text>{aadhaarData.address}</Text>
                    </ScrollView>
                }

                {/* Final verify */}
                <TouchableOpacity onPress={() => {
                    // navigation.navigate('BookingConfirm');
                    verify();
                }} style={{backgroundColor: "#eb2c19",alignItems:'center',padding: 15,borderRadius: 8,margin:20,marginTop:30}}>
                    <Text style={{ color: "#fff",fontFamily:'Poppins-SemiBold',fontSize:16 }}>Verify Now</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    // navigation.navigate('DisplayDetails');
                    // verify();
                    navigation.navigate('BookingConfirm', {data : qrData});
                }} style={{backgroundColor: "#eb2c19",alignItems:'center',padding: 15,borderRadius: 8,margin:20,marginTop:30}}>
                    <Text style={{ color: "#fff",fontFamily:'Poppins-SemiBold',fontSize:16 }}>Verify Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
  },
});