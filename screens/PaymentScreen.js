import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentScreen = ({ appointmentDetails = {}, goBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Confirmation</Text>
      <Text style={styles.info}>Doctor: {appointmentDetails.doctorName}</Text>
      <Text style={styles.info}>Date: {appointmentDetails.dateDisplay}</Text>
      <Text style={styles.info}>Slot: {appointmentDetails.slot}</Text>
      <Text style={styles.info}>Fee: ₹500</Text>

      <TouchableOpacity style={styles.payButton} onPress={goBack}>
        <Text style={styles.payButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10 },
  payButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
