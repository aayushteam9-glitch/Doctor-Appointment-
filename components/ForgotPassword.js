import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ForgotPassword = ({ goBack, goToResetPassword }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

  // Timer for OTP resend (UNCHANGED)
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Send OTP (UNCHANGED)
  const handleSendOtp = () => {
    setError('');

    if (!email && !phone) {
      setError('Please enter Email or Mobile Number');
      return;
    }

    if (phone && phone.length !== 10) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    setOtpSent(true);
    setTimer(30);
  };

  // Handle Verify OTP (UNCHANGED)
  const handleVerifyOtp = () => {
    setError('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    goToResetPassword();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Recovery</Text>
      <Text style={styles.subtitle}>Enter your details to reset password</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="patient@gmail.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.or}>OR</Text>

      <Text style={styles.inputLabel}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="9876543210"
        value={phone}
        onChangeText={(text) => {
          setPhone(text.replace(/[^0-9]/g, ''));
          if (error) setError('');
        }}
        keyboardType="phone-pad"
        maxLength={10}
        placeholderTextColor="#94a3b8"
      />

      {!otpSent && (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send Verification Code</Text>
        </TouchableOpacity>
      )}

      {otpSent && (
        <>
          <Text style={styles.inputLabel}>Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (error) setError('');
            }}
            keyboardType="numeric"
            placeholderTextColor="#94a3b8"
            maxLength={6}
          />

          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>

          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleSendOtp}>
              <Text style={styles.resendText}>Resend Verification Code</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <TouchableOpacity onPress={goBack} style={styles.loginLink}>
        <Text style={styles.loginText}>← Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  or: {
    textAlign: 'center',
    color: '#94a3b8',
    marginVertical: 8,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  timerText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 8,
    fontSize: 14,
  },
  resendText: {
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default ForgotPassword;