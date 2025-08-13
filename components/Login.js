import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Login = ({ login, goToSignup, goToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill up all required fields');
      return;
    }
    setError('');
    login(email, password);
  };

  const EyeIcon = ({ visible }) => (
    <View style={styles.eyeIconContainer}>
      {visible ? (
        // Eye Open (showing password)
        <View style={styles.eyeIcon}>
          <View style={styles.eyeOuter}>
            <View style={styles.eyeInner}>
              <View style={styles.pupil} />
            </View>
          </View>
        </View>
      ) : (
        // Eye Closed (hiding password)
        <View style={styles.eyeIcon}>
          <View style={styles.eyeOuter}>
            <View style={styles.eyeInner}>
              <View style={styles.pupil} />
            </View>
          </View>
          <View style={styles.eyeSlash} />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Hospital Portal</Text>
          <Text style={styles.subtitle}>Access your medical appointments</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email or Patient ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email or patient ID"
              placeholderTextColor="#A1A1A1"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#A1A1A1"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError('');
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={goToForgotPassword} 
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login to My Health</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>New patient? </Text>
            <TouchableOpacity onPress={goToSignup}>
              <Text style={styles.signupLink}>Register Here</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Need help? Contact hospital support</Text>
          <Text style={styles.footerContact}>support@hospitalname.com | (123) 456-7890</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#005b96',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A6FA5',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E1F0FF',
  },
  errorContainer: {
    backgroundColor: '#FFEEEE',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#2E5984',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#D0E3FF',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#003366',
  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#D0E3FF',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#003366',
    flex: 1,
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'relative',
    width: 22,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOuter: {
    width: 22,
    height: 16,
    borderWidth: 2,
    borderColor: '#4A6FA5',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  eyeInner: {
    width: 14,
    height: 12,
    borderRadius: 7,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A6FA5',
  },
  eyeSlash: {
    position: 'absolute',
    width: 26,
    height: 2,
    backgroundColor: '#4A6FA5',
    transform: [{ rotate: '45deg' }],
    top: 7,
    left: -2,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#005b96',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#0077b6',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1F0FF',
  },
  dividerText: {
    color: '#7F9EB2',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#4A6FA5',
    fontSize: 14,
  },
  signupLink: {
    color: '#005b96',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#4A6FA5',
    fontSize: 12,
  },
  footerContact: {
    color: '#005b96',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default Login;