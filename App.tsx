import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Alert } from 'react-native';

import DashboardScreen from './screens/DashboardScreen';
import NewAppointmentScreen from './screens/NewAppointmentScreen';
import DoctorListScreen from './screens/DoctorListScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScheduledAppointmentsScreen from './screens/ScheduledAppointmentsScreen';
import PrescriptionScreen from './screens/PrescriptionScreen';
import ReportScreen from './screens/ReportScreen'; 

import Login from './components/Login';
import Signup from './components/Signup';
import SplashScreen from './components/SplashScreen';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

import SlidingSidebar from './components/SlidingSidebar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(undefined);
  const [appointments, setAppointments] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setCurrentScreen('login');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message: string, type: string = 'info') => {
    setNotification({ visible: true, message, type });
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(-100);
    
    // Slide in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      // After showing for 2 seconds, slide out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          setNotification({ visible: false, message: '', type: '' });
        });
      }, 2000);
    });
  };

  const handleLogin = (email: any, password: any) => {
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentScreen('dashboard');
      showNotification('Login successful!', 'success');
    } else {
      showNotification('Please enter email and password', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    showNotification('You have been logged out successfully', 'success');
  };

  // Navigation helpers
  const goToLogin = () => setCurrentScreen('login');
  const goToSignup = () => setCurrentScreen('signup');
  const goToForgotPassword = () => setCurrentScreen('forgotPassword');
  const goToResetPassword = () => setCurrentScreen('resetPassword');
  const goToDoctorDashboard = () => setCurrentScreen('dashboard');
  const goToDoctorList = () => setCurrentScreen('doctorList');
  const goToProfile = () => setCurrentScreen('profile');
  const goToScheduledAppointments = () => setCurrentScreen('appointments');
  const onGoToPrescriptions = () => setCurrentScreen('prescription');
  const goToReportScreen = () => setCurrentScreen('report'); 
  const goBackToDoctorList = () => setCurrentScreen('doctorList');

  const goToNewAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setCurrentScreen('newAppointment');
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Splash Screen
  if (loading || currentScreen === 'splash') {
    return <SplashScreen />;
  }

  // Auth Screens
  if (currentScreen === 'login') {
    return (
      <View style={styles.container}>
        <Login
          login={handleLogin}
          goToSignup={goToSignup}
          goToForgotPassword={goToForgotPassword}
        />
        {notification.visible && (
          <Animated.View 
            style={[
              styles.notificationContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: notification.type === 'error' ? '#ff4444' : 
                                notification.type === 'success' ? '#00C851' : '#33b5e5'
              }
            ]}
          >
            <Text style={styles.notificationText}>{notification.message}</Text>
          </Animated.View>
        )}
      </View>
    );
  }

  if (currentScreen === 'signup') {
    return <Signup goToLogin={goToLogin} />;
  }

  if (currentScreen === 'forgotPassword') {
    return (
      <ForgotPassword
        goBack={goToLogin}
        goToResetPassword={goToResetPassword}
      />
    );
  }

  if (currentScreen === 'resetPassword') {
    return <ResetPassword goToLogin={goToLogin} />;
  }

  if (currentScreen === 'prescription') {
    return <PrescriptionScreen goBack={goToDoctorDashboard} />;
  }

  if (currentScreen === 'doctorList') {
    return (
      <DoctorListScreen
        goBack={goToDoctorDashboard}
        onSelectDoctor={goToNewAppointment}
      />
    );
  }

  if (currentScreen === 'newAppointment') {
    return (
      <NewAppointmentScreen
        doctor={selectedDoctor}
        appointments={appointments}
        setAppointments={setAppointments}
        goBack={goToDoctorList}
      />
    );
  }

  if (currentScreen === 'profile') {
    return <ProfileScreen goBack={goToDoctorDashboard} />;
  }

  if (currentScreen === 'appointments') {
    return (
      <ScheduledAppointmentsScreen
        goBack={goToDoctorList}
        appointments={appointments}
      />
    );
  }

  if (currentScreen === 'report') {
    return <ReportScreen goBack={goToDoctorDashboard} />;
  }

  // Dashboard (default)
  return (
    <View style={styles.container}>
      <DashboardScreen
        isLoggedIn={isLoggedIn}
        login={isLoggedIn ? handleLogout : goToLogin}
        goToDoctorList={goToDoctorList}
        goToProfile={goToProfile}
        goToScheduledAppointments={goToScheduledAppointments}
        toggleSidebar={toggleSidebar}
        goToPrescriptions={onGoToPrescriptions}
      />

      <SlidingSidebar
        visible={isSidebarVisible}
        onClose={toggleSidebar}
        onLogout={handleLogout}
        onGoToProfile={goToProfile}
        onGoToAppointments={goToScheduledAppointments}
        onGoToPrescriptions={onGoToPrescriptions}
        onGoToReports={goToReportScreen} 
        user={{ name: 'Ayush', image: '' }}
      />

      {notification.visible && (
        <Animated.View 
          style={[
            styles.notificationContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: notification.type === 'error' ? '#ff4444' : 
                            notification.type === 'success' ? '#00C851' : '#33b5e5'
            }
          ]}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});