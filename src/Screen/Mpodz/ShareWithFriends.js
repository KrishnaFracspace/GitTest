import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Share from 'react-native-share';

const ShareWithFriends = () => {
    const handleShare = async () => {
        const shareOptions = {
            title: 'Share Referral Code with friends',
            message: 'Invite friends using your referral link and unlock exciting offers or coupons!\n',
            // url: 'https://play.google.com/store/apps/details?id=com.fracspace',
            code: ''
        };

        try {
            await Share.open(shareOptions);
        } catch (err) {
            console.log('Sharing error:', err);
        }
    };

  return (
    <TouchableOpacity onPress={handleShare} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={{backgroundColor:'#eb2c19',padding:10,paddingHorizontal:80,marginTop:40,borderRadius:5,alignItems:'center'}}>
            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Share</Text>
        </View>
    </TouchableOpacity>
  );
};

export default ShareWithFriends;

