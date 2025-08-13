import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  Easing,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Combined animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <Image
          source={require('../components/assets/doctor.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Doctor Appointment</Text>
        <Text style={styles.tagline}>Your Health, Our Priority</Text>
        
        {/* Animated loading indicator */}
        <Animated.View style={[styles.loadingIndicator, { opacity: fadeAnim }]}>
          <View style={styles.loadingBar} />
        </Animated.View>
      </Animated.View>
      
      {/* Footer */}
      <Animated.Text style={[styles.footerText, { opacity: fadeAnim }]}>
        © {new Date().getFullYear()} HealthCare Inc.
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a86ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: height * 0.1,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
    marginBottom: 15,
    tintColor: '#fff', // Optional: if you want the logo to be white
  },
  appName: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 30,
  },
  loadingIndicator: {
    width: width * 0.3,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});