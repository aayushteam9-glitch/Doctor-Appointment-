// screens/ScheduledAppointmentsScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const dummyAppointments = [
  { 
    id: '1', 
    doctor: 'Dr. Sharma', 
    specialty: 'Cardiology',
    date: '2025-07-20', 
    time: '10:00 AM',
    location: 'City Hospital, Room 205',
    address: '123 Medical Drive, Health City',
    duration: '30 mins',
    purpose: 'Follow-up Consultation',
    notes: 'Please bring your recent test results'
  },
  { 
    id: '2', 
    doctor: 'Dr. Verma', 
    specialty: 'Dermatology',
    date: '2025-07-22', 
    time: '3:00 PM',
    location: 'Skin Care Center, Suite 10',
    address: '456 Wellness Avenue, Health City',
    duration: '45 mins',
    purpose: 'Annual Skin Check',
    notes: 'Avoid makeup on appointment day'
  },
  { 
    id: '3', 
    doctor: 'Dr. Aditi Patel', 
    specialty: 'Pediatrics',
    date: '2025-07-24', 
    time: '1:30 PM',
    location: 'Childrens Health Center',
    address: '789 Pediatric Lane, Health City',
    duration: '20 mins',
    purpose: 'Vaccination',
    notes: 'Bring vaccination card'
  },
  { 
    id: '4', 
    doctor: 'Dr. Manish Rao', 
    specialty: 'Orthopedics',
    date: '2025-07-25', 
    time: '9:00 AM',
    location: 'Bone & Joint Clinic',
    address: '321 Ortho Street, Health City',
    duration: '60 mins',
    purpose: 'Post-surgery Evaluation',
    notes: 'Bring X-ray films'
  },
];

const ScheduledAppointmentsScreen = ({ goBack }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheduled Appointments</Text>
      </View>

      {/* Appointments List */}
      <FlatList
        data={dummyAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.doctorName}>{item.doctor}</Text>
                <Text style={styles.specialtyText}>{item.specialty}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Upcoming</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>⏰</Text>
              <Text style={styles.detailText}>{item.time} ({item.duration})</Text>
            </View>
            
            {expandedId === item.id && (
              <View style={styles.expandedDetails}>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Appointment Details</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>🏥</Text>
                    <Text style={styles.detailText}>{item.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{item.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📝</Text>
                    <Text style={styles.detailText}>Purpose: {item.purpose}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>✏️</Text>
                    <Text style={styles.detailText}>{item.notes}</Text>
                  </View>
                </View>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={styles.actionText}>
                {expandedId === item.id ? 'Hide Details' : 'View Details'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ScheduledAppointmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 8,
    paddingRight: 1,
  },
  backIcon: {
    fontSize: 22,
    color: '#4a6bff',
    marginRight: 6,
  },
  backText: {
    fontSize: 16,
    color: '#4a6bff',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  specialtyText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#e1f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a6bff',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 10,
    fontSize: 16,
    marginTop: 2,
  },
  detailText: {
    fontSize: 15,
    color: '#4a5568',
    flex: 1,
  },
  expandedDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: '#f1f1f1',
  },
  detailSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#4a6bff',
    fontWeight: '500',
    fontSize: 15,
  },
});