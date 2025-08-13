// screens/ProfileScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileScreen = ({ goBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>

      {/* Add more profile details here */}
      <Text style={styles.info}>Name: Aayush</Text>
      <Text style={styles.info}>Email: aayush@example.com</Text>

      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6fc' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, marginVertical: 8 },
  backButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#3a86ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  backText: { color: '#fff', fontSize: 16 },
});
