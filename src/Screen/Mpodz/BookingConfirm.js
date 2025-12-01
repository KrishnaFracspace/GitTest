import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import QRCode from 'react-native-qrcode-svg'

export default function BookingConfirm(props) {

    // console.log("qrData: ",props?.route?.params?.qrData);
    // const [qrData, setQrData]
    const [pin ,setPin] = useState("1234");
    const [qrData, setQrData] = useState(props?.route?.params?.qrData);
    // console.log("QRData: ",props.route.params.detail);

    const handleCopy = () => {
        Alert.alert("Copied", `Gate PIN ${pin} copied to clipboard`);
        // Optionally: Clipboard.setString(pin); // add if you want copy feature
    };

  return (
    <View style={{flex:1,backgroundColor:'#FFF',justifyContent:'center',alignItems:'center'}}>
        <View style={{backgroundColor:'#FFF',borderRadius:16,padding:24,width:'85%',alignItems:'center',elevation:5,shadowColor:'#000',shadowOpacity:0.1,shadowOffset:{width:0,height:4},shadowRadius:6}}>
            <QRCode
                value={qrData.qrCode}
                size={200}
                color='#000'
                backgroundColor='#fff'
            />

            <View style={{alignItems:'center',marginTop:10}}>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000',marginBottom:5}}>Guest: {qrData.guestName}</Text>
                <Text style={{fontFamily:'Poppins-Regular',fontSize:16,color:'#666',marginBottom:5}}>Room: {qrData.roomNumber}</Text>
                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#888',textAlign:'center'}}>Valid: {new Date(qrData.validFrom).toLocaleString()} - {new Date(qrData.validUntil).toLocaleString()}</Text>
            </View>

            <Text style={{fontSize: 22, fontWeight: "bold", marginVertical: 12, color: "#2c3e50" }}>🎉 Booking Confirmed</Text>
            <Text style={{fontSize: 16, marginBottom: 20, textAlign: "center", color: "#34495e"}}>Use this Pin as your{`\n`}
                <Text style={{fontFamily:'Poppins-Bold'}}>Gate Code</Text>: 
            </Text>

            <View style={{backgroundColor:'#ecf0f1',borderRadius:12,paddingVertical:16,paddingHorizontal:40,marginBottom:20}}>
                <Text style={{fontSize:32,fontFamily:'Poppins-Bold',letterSpacing:8,color:'#27ae60'}}>{pin}</Text>
            </View>

            <Text style={{fontSize: 14, textAlign: "center", color: "#7f8c8d", marginBottom: 25 }}>
                Please keep this PIN safe. You’ll need it to open the gate.
            </Text>
    
            <TouchableOpacity style={{backgroundColor:'#27ae60',paddingVertical:14,paddingHorizontal:40,borderRadius:12}} onPress={handleCopy}>
                <Text style={{color: "#fff", fontSize: 16, fontFamily:'Poppins-SemiBold' }}>Done</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}