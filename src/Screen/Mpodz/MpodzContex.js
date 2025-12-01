import { createContext, useState } from "react";

export const MpodzContext = createContext();

export const MpodzProvider = ({children}) => {

    const [bookingData, setBookingData] = useState({});
    const [referenceId, setReferenceId] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [userDetails, setUserDetails] = useState({});
    const [userPhone, setUserPhone] = useState('');

    return(
        <MpodzContext.Provider
            value={{
                bookingData, setBookingData,
                referenceId, setReferenceId,
                verificationId, setVerificationId,
                userDetails, setUserDetails,
                userPhone, setUserPhone
            }}
        >
            {children}
        </MpodzContext.Provider>
    );
};

