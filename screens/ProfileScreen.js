import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = ({ goBack }) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    name: 'Ayush Bakde',
    email: 'ayush@example.com',
    phone: '+91 9876543210',
    gender: 'Male',
    dob: '12 Jan 2000',
    address: 'Nagpur, Maharashtra, India',
    profilePic: null,
  });

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const chooseImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets[0].uri;
      setUser({ ...user, profilePic: uri });
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>My Profile</Text>

        {/* Profile Picture */}
        <TouchableOpacity onPress={editMode ? chooseImage : null} style={styles.imageContainer}>
          {user.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultImage}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
          )}
          {editMode && <Text style={styles.changePhotoText}>Change Photo</Text>}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          {/* Name */}
          <Text style={styles.label}>Name:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={text => handleInputChange('name', text)}
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}

          {/* Email */}
          <Text style={styles.label}>Email:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={text => handleInputChange('email', text)}
            />
          ) : (
            <Text style={styles.value}>{user.email}</Text>
          )}

          {/* Phone */}
          <Text style={styles.label}>Phone:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.phone}
              onChangeText={text => handleInputChange('phone', text)}
            />
          ) : (
            <Text style={styles.value}>{user.phone}</Text>
          )}

          {/* Gender */}
          <Text style={styles.label}>Gender:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.gender}
              onChangeText={text => handleInputChange('gender', text)}
            />
          ) : (
            <Text style={styles.value}>{user.gender}</Text>
          )}

          {/* DOB */}
          <Text style={styles.label}>Date of Birth:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.dob}
              onChangeText={text => handleInputChange('dob', text)}
            />
          ) : (
            <Text style={styles.value}>{user.dob}</Text>
          )}

          {/* Address */}
          <Text style={styles.label}>Address:</Text>
          {editMode ? (
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={user.address}
              multiline
              onChangeText={text => handleInputChange('address', text)}
            />
          ) : (
            <Text style={styles.value}>{user.address}</Text>
          )}
        </View>

        {/* Edit / Save Button - Now properly visible */}
        <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
          <Text style={styles.editText}>{editMode ? 'Save' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Added padding to ensure button is visible
  },
  backButton: {
    margin: 20,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#2e86de',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: '#fff',
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: {
    color: '#2e86de',
    marginTop: 8,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    color: '#333',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  input: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 5,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#2e86de',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});