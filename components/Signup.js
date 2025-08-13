import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';

const CustomDropdown = ({ 
  placeholder, 
  value, 
  onSelect, 
  options, 
  style 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (selectedValue) => {
    onSelect(selectedValue);
    setIsVisible(false);
  };

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.dropdownText,
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Signup = ({ goToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const districtsMap = {
    Rajasthan: ['Kota', 'Jaipur', 'Udaipur'],
    Maharashtra: ['Pune', 'Mumbai', 'Nagpur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
    Bihar: ['Patna', 'Gaya', 'Bhagalpur'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur'],
    'Tamil Nadu': ['Chennai', 'Madurai', 'Coimbatore'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  };

  const states = Object.keys(districtsMap);

  const handleRegister = () => {
    setError('');

    if (!name || !email || !phone || !state || !district || !password || !confirmPassword) {
      setError('Please fill in all the fields');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    if (password.length !== 5 || !/^\d+$/.test(password)) {
      setError('Password must be a 5-digit number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // If all validations pass
    setError('Success: Registered Successfully!');
    setTimeout(() => {
      goToLogin();
    }, 1500);
  };

  const handleStateSelect = (selectedState) => {
    setState(selectedState);
    setDistrict(''); // Reset district when state changes
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Patient Registration</Text>
      <Text style={styles.subtitle}>Create your hospital portal account</Text>

      {error ? (
        <View style={[
          styles.noticeContainer,
          error.startsWith('Success') ? styles.successNotice : styles.errorNotice
        ]}>
          <Text style={styles.noticeText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient's full name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="patient@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit mobile number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>State</Text>
        <CustomDropdown
          placeholder="select state"
          value={state}
          onSelect={handleStateSelect}
          options={states}
        />
      </View>

      {state ? (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>District</Text>
          <CustomDropdown
            placeholder="select district"
            value={district}
            onSelect={setDistrict}
            options={districtsMap[state] || []}
          />
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Medical PIN</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Create 5-digit medical PIN"
            value={password}
            onChangeText={setPassword}
            keyboardType="numeric"
            secureTextEntry={!showPassword}
            maxLength={5}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <View style={styles.eyeIconContainer}>
              {showPassword ? (
                // Eye closed icon
                <View style={styles.eyeIcon}>
                  <View style={styles.eyeShape}>
                    <View style={styles.eyeball} />
                  </View>
                  <View style={styles.eyeSlash} />
                </View>
              ) : (
                // Eye open icon
                <View style={styles.eyeIcon}>
                  <View style={styles.eyeShape}>
                    <View style={styles.eyeball} />
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.hintText}>For appointment access (5 digits only)</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Medical PIN</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Re-enter your medical PIN"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            keyboardType="numeric"
            secureTextEntry={!showConfirmPassword}
            maxLength={5}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
          >
            <View style={styles.eyeIconContainer}>
              {showConfirmPassword ? (
                // Eye closed icon
                <View style={styles.eyeIcon}>
                  <View style={styles.eyeShape}>
                    <View style={styles.eyeball} />
                  </View>
                  <View style={styles.eyeSlash} />
                </View>
              ) : (
                // Eye open icon
                <View style={styles.eyeIcon}>
                  <View style={styles.eyeShape}>
                    <View style={styles.eyeball} />
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister}
        activeOpacity={0.8}
      >
        <Text style={styles.registerButtonText}>Register Patient</Text>
      </TouchableOpacity>

      <View style={styles.loginPrompt}>
        <Text style={styles.loginText}>Already registered? </Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  // Custom Dropdown Styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#94a3b8',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionText: {
    fontSize: 16,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: 18,
    height: 12,
    position: 'relative',
  },
  eyeShape: {
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderColor: '#64748b',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  eyeball: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748b',
  },
  eyeSlash: {
    position: 'absolute',
    width: 20,
    height: 1.5,
    backgroundColor: '#64748b',
    transform: [{ rotate: '45deg' }],
    top: 5,
    left: -1,
  },
  hintText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
    alignItems: 'center',
    elevation: 2,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  noticeContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorNotice: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  successNotice: {
    backgroundColor: '#dcfce7',
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  noticeText: {
    color: '#0f172a',
    fontSize: 14,
  },
});

export default Signup;