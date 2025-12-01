import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import axios from "axios";
import { MpodzContext } from "./MpodzContex";

export default function DisplayDetails({ route }) {
//   const { verificationId, referenceId } = route.params; // From deep link
    const { referenceId, verificationId } = useContext(MpodzContext);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1️⃣ Call GET Status API
                const statusRes = await axios.get(
                    `https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/status?verification_id=${verificationId}`
                );

                setStatus(statusRes.data.status);

                if (statusRes.data.status === "SUCCESS") {
                    // 2️⃣ Call Fetch Document API
                    const docRes = await axios.post(
                        "https://metropodz-mvp.onrender.com/api/v1/kyc/digilocker/document",
                        {
                            verification_id: verificationId,
                            reference_id: referenceId,
                            document_type: "AADHAAR", // Adjust as needed
                        }
                    );

                    setDocuments(docRes.data.documents || []);
                }
            } catch (err) {
                console.error("Error fetching DigiLocker data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [verificationId, referenceId]);

    if (loading)
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text>Fetching DigiLocker details...</Text>
        </View>
    );

  return (
    <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Status: {status}</Text>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Documents:</Text>
        {documents.length > 0 ? (
            <FlatList
                data={documents}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={{ marginVertical: 4, fontSize: 16 }}>📄 {item.name}</Text>
                )}
            />
        ) : (
            <Text>No documents found.</Text>
        )}
    </View>
  );
};

