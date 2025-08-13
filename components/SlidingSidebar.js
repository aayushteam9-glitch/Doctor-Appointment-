import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SlidingSidebar = ({
  visible,
  onClose,
  onLogout,
  onGoToProfile,
  onGoToAppointments,
  onGoToPrescriptions,
  onGoToReports, 
  user,
}) => {
  const [isRendered, setIsRendered] = useState(visible);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsRendered(false);
      });
    }
  }, [visible]);

  if (!isRendered) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={4}
            reducedTransparencyFallbackColor="white"
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.profileContainer}>
          <View style={styles.profilePicWrapper}>
            <Image
              source={
                user?.image
                  ? { uri: user.image }
                  : require('../components/assets/profile.jpg')
              }
              style={styles.profilePic}
            />
          </View>
          <Text style={styles.profileName}>{user?.name || 'Ayush'}</Text>
        </View>

        <Text style={styles.title}>Menu</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onGoToProfile();
            onClose();
          }}
        >
          <Text style={styles.menuText}>👤 Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onGoToAppointments();
            onClose();
          }}
        >
          <Text style={styles.menuText}>📅 Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onGoToPrescriptions();
            onClose();
          }}
        >
          <Text style={styles.menuText}>💊 My Prescriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onGoToReports(); // ✅ Call the prop function
            onClose();
          }}
        >
          <Text style={styles.menuText}>📄 Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            onLogout();
            onClose();
          }}
        >
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SlidingSidebar;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    width: 260,
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 22,
    color: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    color: '#333',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 14,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
