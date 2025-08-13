import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

// Local doctor data with images
const doctors = [
  {
    id: '1',
    name: 'Dr. Mehta',
    specialty: 'Cardiologist',
    image: require('../components/assets/1.jpg'),
  },
  {
    id: '2',
    name: 'Dr. Sharma',
    specialty: 'Dentist',
    image: require('../components/assets/2.jpg'),
  },
  {
    id: '3',
    name: 'Dr. Kapoor',
    specialty: 'Pediatrician',
    image: require('../components/assets/3.jpg'),
  },
  {
    id: '4',
    name: 'Dr. Awasthi',
    specialty: 'Orthopedic',
    image: require('../components/assets/4.jpg'),
  },
  {
    id: '5',
    name: 'Dr. Iyer',
    specialty: 'Neurologist',
    image: require('../components/assets/5.jpeg'),
  },
];

// DoctorListScreen Component
const DoctorListScreen = ({ onSelectDoctor, goBack }) => {
  const [searchText, setSearchText] = useState('');

  // Filter doctors based on search text
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>All Doctors</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search doctor by name..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Doctor List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelectDoctor(item)}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No doctor found.</Text>
        }
      />
    </View>
  );
};

export default DoctorListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 5,
  },
  backText: {
    color: '#4a6da7',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  searchBar: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    color: '#2d3436',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6da7',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#dfe6e9',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  specialty: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#95a5a6',
    fontWeight: '500',
  },
});