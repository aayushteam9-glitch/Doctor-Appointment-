import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

import ProfileScreen from './ProfileScreen';
import PrescriptionScreen from './PrescriptionScreen';
import ScheduledAppointmentsScreen from './ScheduledAppointmentsScreen';
import DoctorListScreen from './DoctorListScreen';
import NewAppointmentScreen from './NewAppointmentScreen';

const { width } = Dimensions.get('window');

// Custom Icon Component
const CustomIcon = ({ type, isActive, size = 24, color }) => {
  const iconColor = color || (isActive ? '#3B82F6' : '#9CA3AF');
  
  const iconStyle = {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
  };

  switch (type) {
    case 'home':
      return (
        <View style={iconStyle}>
          <View style={{
            width: size * 0.8,
            height: size * 0.8,
            borderWidth: 2.5,
            borderColor: iconColor,
            borderBottomWidth: 0,
            position: 'relative',
          }}>
            {/* House roof */}
            <View style={{
              position: 'absolute',
              top: -8,
              left: '50%',
              marginLeft: -6,
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderBottomWidth: 8,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: iconColor,
            }} />
            {/* Door */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              marginLeft: -3,
              width: 6,
              height: 8,
              backgroundColor: iconColor,
            }} />
          </View>
        </View>
      );

    case 'prescription':
      return (
        <View style={iconStyle}>
          <View style={{
            width: size * 0.8,
            height: size * 0.9,
            position: 'relative',
          }}>
            {/* Prescription pad/paper */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderWidth: 2.5,
              borderColor: iconColor,
              borderRadius: 3,
              backgroundColor: 'transparent',
            }} />
            {/* Rx symbol */}
            <View style={{
              position: 'absolute',
              top: 3,
              left: 3,
              right: 3,
              height: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: size * 0.3,
                fontWeight: 'bold',
                color: iconColor,
              }}>Rx</Text>
            </View>
            {/* Prescription lines */}
            <View style={{
              position: 'absolute',
              top: 10,
              left: 3,
              right: 3,
              height: 1.5,
              backgroundColor: iconColor,
            }} />
            <View style={{
              position: 'absolute',
              top: 13,
              left: 3,
              right: 5,
              height: 1.5,
              backgroundColor: iconColor,
            }} />
            <View style={{
              position: 'absolute',
              top: 16,
              left: 3,
              right: 4,
              height: 1.5,
              backgroundColor: iconColor,
            }} />
          </View>
        </View>
      );

    case 'booking':
      return (
        <View style={[iconStyle, {
          backgroundColor: '#3B82F6',
          borderRadius: size * 0.5,
        }]}>
          <View style={{
            width: size * 0.6,
            height: 3,
            backgroundColor: 'white',
          }} />
          <View style={{
            position: 'absolute',
            width: 3,
            height: size * 0.6,
            backgroundColor: 'white',
          }} />
        </View>
      );

    case 'appointments':
      return (
        <View style={iconStyle}>
          <View style={{
            width: size * 0.8,
            height: size * 0.8,
            position: 'relative',
          }}>
            {/* Clipboard base */}
            <View style={{
              position: 'absolute',
              top: 3,
              left: 2,
              right: 2,
              bottom: 0,
              borderWidth: 2.5,
              borderColor: iconColor,
              borderRadius: 2,
            }} />
            {/* Clipboard clip */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: '35%',
              right: '35%',
              height: 6,
              backgroundColor: iconColor,
              borderRadius: 3,
            }} />
            {/* Document lines */}
            <View style={{
              position: 'absolute',
              top: 8,
              left: 5,
              right: 5,
              height: 1.5,
              backgroundColor: iconColor,
            }} />
            <View style={{
              position: 'absolute',
              top: 11,
              left: 5,
              right: 8,
              height: 1.5,
              backgroundColor: iconColor,
            }} />
            <View style={{
              position: 'absolute',
              top: 14,
              left: 5,
              right: 6,
              height: 1.5,
              backgroundColor: iconColor,
            }} />
          </View>
        </View>
      );

    case 'profile':
      return (
        <View style={iconStyle}>
          <View style={{
            width: size * 0.8,
            height: size * 0.8,
            position: 'relative',
          }}>
            {/* Head */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              marginLeft: -6,
              width: 12,
              height: 12,
              borderWidth: 2.5,
              borderColor: iconColor,
              borderRadius: 6,
            }} />
            {/* Body */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              marginLeft: -8,
              width: 16,
              height: 10,
              borderWidth: 2.5,
              borderColor: iconColor,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomWidth: 0,
            }} />
          </View>
        </View>
      );

    default:
      return <View style={iconStyle} />;
  }
};

const doctors = [
  { id: 1, name: 'Ralph Edward', specialty: 'Dentist Specialist', rating: 4.8, image: require('../components/assets/1.jpg'), available: true, nextSlot: '10:30 AM' },
  { id: 2, name: 'Bessie Cooper', specialty: 'Surgery Specialist', rating: 4.5, image: require('../components/assets/2.jpg'), available: true, nextSlot: '2:00 PM' },
  { id: 3, name: 'Annette Black', specialty: 'Urology Specialist', rating: 4.2, image: require('../components/assets/3.jpg'), available: false, nextSlot: 'Tomorrow' },
  { id: 4, name: 'Dr. Wilson', specialty: 'ENT Specialist', rating: 4.6, image: require('../components/assets/4.jpg'), available: true, nextSlot: '4:15 PM' },
  { id: 5, name: 'Dr. Brown', specialty: 'Eye Specialist', rating: 4.3, image: require('../components/assets/5.jpeg'), available: true, nextSlot: '11:45 AM' },
];

const DashboardScreen = ({ toggleSidebar }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [expandedActions, setExpandedActions] = useState({});
  const [animation] = useState(new Animated.Value(0));

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDoctors = doctors.filter(doctor => doctor.available);

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentScreen('newAppointment');
  };

  const toggleActionExpansion = (appointmentId) => {
    setExpandedActions(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }));

    Animated.timing(animation, {
      toValue: expandedActions[appointmentId] ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const getActionStyle = (appointmentId) => {
    const heightInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60] // Adjust based on your content height
    });

    return {
      height: expandedActions[appointmentId] ? 60 : 0,
      opacity: animation,
      overflow: 'hidden',
    };
  };

  if (currentScreen === 'profile') return <ProfileScreen goBack={() => setCurrentScreen('dashboard')} />;
  if (currentScreen === 'prescription') return <PrescriptionScreen goBack={() => setCurrentScreen('dashboard')} />;
  if (currentScreen === 'appointments') return <ScheduledAppointmentsScreen goBack={() => setCurrentScreen('dashboard')} />;
  if (currentScreen === 'dateSelection') {
    // Handle calendar/date selection screen - for now redirect to dashboard
    // You can create a dedicated DateSelectionScreen component if needed
    setCurrentScreen('dashboard');
  }
  if (currentScreen === 'doctorList') {
    return (
      <DoctorListScreen
        goBack={() => setCurrentScreen('dashboard')}
        onSelectDoctor={(doctor) => {
          setSelectedDoctor(doctor);
          setCurrentScreen('newAppointment');
        }}
      />
    );
  }
  if (currentScreen === 'newAppointment' && selectedDoctor) {
    return (
      <NewAppointmentScreen
        doctor={selectedDoctor}
        selectedDate={selectedDate}
        goBack={() => {
          setSelectedDoctor(null);
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [15, 16, 17, 18, 19, 20];

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const appointmentsData = [
    { id: 1, name: 'Dr. Lailas Russell', specialty: 'Dermatologist', time: '20 Sep - 12:30 PM', type: 'video', 
      callInfo: 'Call number: +91 1234567809', 
      smsInfo: 'SMS will be sent to: +91 1234567809' },
    { id: 2, name: 'Dr. Anuj Sharma', specialty: 'Cardiologist', time: '21 Sep - 09:00 AM', type: 'clinic', 
      callInfo: 'Call number: +91 7894561023', 
      smsInfo: 'SMS will be sent to: +91 7894561023' },
    { id: 3, name: 'Dr. Nidhi Mehta', specialty: 'Pediatrician', time: '22 Sep - 03:00 PM', type: 'video', 
      callInfo: 'Call number: +91 4567890123', 
      smsInfo: 'SMS will be sent to: +91 4567890123' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>{getCurrentTime()}</Text>
            <Text style={styles.nameText}>Aayush 👋</Text>
          </View>
          <TouchableOpacity onPress={toggleSidebar} style={styles.profileContainer}>
            <Image source={require('../components/assets/profile.jpg')} style={styles.profileImage} />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>

        {/* Modern Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search doctors, specialties..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Enhanced Date Selector */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((date, index) => (
              <TouchableOpacity 
                key={date} 
                onPress={() => setSelectedDate(selectedDate === date ? null : date)}
                style={[
                  styles.dateCard, 
                  selectedDate === date && styles.selectedDateCard
                ]}
              >
                <Text style={[
                  styles.dayText, 
                  selectedDate === date && styles.selectedDayText
                ]}>
                  {weekdays[index]}
                </Text>
                <Text style={[
                  styles.dateText, 
                  selectedDate === date && styles.selectedDateText
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Available Doctors Section - Shows only when date is selected */}
        {selectedDate && (
          <View style={styles.availableDoctorsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Doctors</Text>
              <Text style={styles.selectedDateInfo}>Sep {selectedDate}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {availableDoctors.map((doctor) => (
                <TouchableOpacity key={doctor.id} style={styles.availableDoctorCard}>
                  <View style={styles.doctorImageContainer}>
                    <Image source={doctor.image} style={styles.doctorImage} />
                    <View style={styles.availableBadge}>
                      <View style={styles.availableDot} />
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  </View>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <View style={styles.timeSlotContainer}>
                    <Text style={styles.timeSlotLabel}>Next slot:</Text>
                    <Text style={styles.timeSlot}>{doctor.nextSlot}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => handleBookNow(doctor)}
                  >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Top Doctors Section - Always visible */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>Top Doctors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(searchQuery ? filteredDoctors : doctors).map((doctor) => (
              <TouchableOpacity key={doctor.id} style={styles.doctorCard}>
                <View style={styles.doctorImageContainer}>
                  <Image source={doctor.image} style={styles.doctorImage} />
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
                  </View>
                </View>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Modern Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={[styles.categoryCard, styles.hospitalCard]}>
              <Text style={styles.categoryIcon}>🏥</Text>
              <Text style={styles.categoryText}>Hospital</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, styles.consultantCard]}>
              <Text style={styles.categoryIcon}>👨‍⚕</Text>
              <Text style={styles.categoryText}>Consultant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, styles.pharmacyCard]}>
              <Text style={styles.categoryIcon}>💊</Text>
              <Text style={styles.categoryText}>Pharmacy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('appointments')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {appointmentsData.map((appointment) => (
            <View key={appointment.id}>
              <TouchableOpacity 
                style={styles.appointmentCard}
                onPress={() => toggleActionExpansion(appointment.id)}
              >
                <View style={styles.appointmentLeft}>
                  <View style={[
                    styles.appointmentType, 
                    appointment.type === 'video' ? styles.videoType : styles.clinicType
                  ]}>
                    <Text style={styles.appointmentIcon}>
                      {appointment.type === 'video' ? '📹' : '🏥'}
                    </Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentDoctor}>{appointment.name}</Text>
                    <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                    <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  </View>
                </View>
                <View style={styles.appointmentActions}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => toggleActionExpansion(appointment.id)}
                  >
                    <Text style={styles.actionIcon}>📞</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => toggleActionExpansion(appointment.id)}
                  >
                    <Text style={styles.actionIcon}>💬</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Expandable Action Content */}
              <Animated.View 
                style={[
                  styles.expandableContent,
                  { 
                    height: expandedActions[appointment.id] ? 60 : 0,
                    opacity: expandedActions[appointment.id] ? 1 : 0 
                  }
                ]}
              >
                <View style={styles.actionInfoContainer}>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionInfoText}>{appointment.callInfo}</Text>
                  </View>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionInfoText}>{appointment.smsInfo}</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          ))}
        </View>

        {/* Health Tip Card */}
        <View style={styles.healthTipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipTitle}>Today's Health Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Stay hydrated! Aim for 8 glasses of water daily to maintain optimal health and energy levels.
          </Text>
        </View>
      </ScrollView>

      {/* Updated Bottom Navigation with Correct Sequence */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          {[
            { screen: 'dashboard', iconType: 'home', label: 'Home', isActive: currentScreen === 'dashboard' },
            { screen: 'prescription', iconType: 'prescription', label: 'Prescription', isActive: currentScreen === 'prescription' },
            { screen: 'doctorList', iconType: 'booking', label: 'Booking', isAdd: true },
            { screen: 'appointments', iconType: 'appointments', label: 'Appointments', isActive: currentScreen === 'appointments' },
            { screen: 'profile', iconType: 'profile', label: 'Profile', isActive: currentScreen === 'profile' },
          ].map((item) => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => setCurrentScreen(item.screen)}
              style={[
                styles.navItem,
                item.isAdd && styles.addButton,
                item.isActive && !item.isAdd && styles.activeNavItem
              ]}
            >
              <CustomIcon 
                type={item.iconType} 
                isActive={item.isActive}
                size={item.isAdd ? 28 : 24}
              />
              <Text style={[
                styles.navLabel,
                item.isActive && !item.isAdd && styles.activeNavLabel,
                item.isAdd && styles.addLabel
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsla(210, 100%, 98%, 1.00)',
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 10,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },

  // Date Section
  dateSection: {
    marginBottom: 24,
  },
  dateScroll: {
    marginTop: 12,
  },
  dateCard: {
    backgroundColor: '#f8f2f2ff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#fbf4f4ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedDateCard: {
    backgroundColor: '#3B82F6',
  },
  dayText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },

  // Available Doctors Section
  availableDoctorsSection: {
    marginBottom: 24,
  },
  selectedDateInfo: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  availableDoctorCard: {
    backgroundColor: '#f8f2f2ff',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    width: 180,
    shadowColor: '#f7f4f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  availableBadge: {
    position: 'absolute',
    bottom: -6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  availableDot: {
    width: 6,
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
    marginRight: 4,
  },
  availableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065F46',
  },
  timeSlotContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  timeSlotLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  timeSlot: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Doctors Section
  doctorsSection: {
    marginBottom: 24,
  },
  doctorCard: {
    backgroundColor: '#f8f2f2ff',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    width: 160,
    shadowColor: '#fbf4f4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  doctorImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Categories
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#f8f2f2ff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hospitalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  consultantCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  pharmacyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Appointments Section
  appointmentsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#f8f2f2ff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    borderRadius: 1,
    padding: 16,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appointmentType: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  videoType: {
    backgroundColor: '#DBEAFE',
  },
  clinicType: {
    backgroundColor: '#FEF3C7',
  },
  appointmentIcon: {
    fontSize: 20,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  appointmentSpecialty: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 8,
  },
  messageButton: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 16,
  },

  // Expandable Content Styles
  expandableContent: {
    backgroundColor: '#f8f2f2ff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  actionInfoContainer: {
    flex: 1,
  },
  actionInfo: {
    marginBottom: 8,
  },
  actionInfoText: {
    fontSize: 12,
    color: '#4B5563',
  },

  // Health Tip
  healthTipCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
  },

  // Enhanced Bottom Navigation with Custom Icons
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    minWidth: 60,
  },
  activeNavItem: {
    backgroundColor: '#EFF6FF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#f0f2f6ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  addLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});