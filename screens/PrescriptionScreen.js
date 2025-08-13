import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const PrescriptionScreen = ({ goBack }) => {
  const prescriptions = [
    {
      id: 1,
      doctor: 'Dr. Mehta',
      date: '2025-07-10',
      medicines: ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Vitamin D3'],
    },
    {
      id: 2,
      doctor: 'Dr. Sharma',
      date: '2025-06-28',
      medicines: ['Ibuprofen 200mg', 'Cetrizine 10mg'],
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Prescriptions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {prescriptions.map((prescription) => (
          <View key={prescription.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.doctorName}>{prescription.doctor}</Text>
              <Text style={styles.date}>{prescription.date}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.medicinesTitle}>Medications</Text>
            {prescription.medicines.map((med, index) => (
              <View key={index} style={styles.medicineItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.medicineText}>{med}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrescriptionScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  medicinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 12,
  },
  medicineText: {
    fontSize: 15,
    color: '#334155',
  },
});