import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const morningSlots = ['10:00 To 10:30', '10:30 To 11:00', '11:00 To 11:30', '11:30 To 12:00'];
const eveningSlots = ['6:00 To 6:30', '6:30 To 7:00', '7:00 To 7:30', '7:30 To 8:00'];

// Custom Notification Component
const CustomNotification = ({ 
  visible, 
  message, 
  type = 'notice',
  onClose,
  duration = 4000 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();

      if (duration > 0) {
        setTimeout(() => {
          hideNotification();
        }, duration);
      }
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  const getNotificationStyle = () => {
    switch (type) {
      case 'error':
        return {
          backgroundColor: '#fee',
          borderColor: '#fcc',
          borderLeftColor: '#e74c3c',
          iconColor: '#e74c3c',
          textColor: '#c0392b'
        };
      case 'success':
        return {
          backgroundColor: '#efe',
          borderColor: '#cfc',
          borderLeftColor: '#27ae60',
          iconColor: '#27ae60',
          textColor: '#1e8449'
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          borderLeftColor: '#f39c12',
          iconColor: '#f39c12',
          textColor: '#856404'
        };
      case 'notice':
      default:
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          borderLeftColor: '#f39c12',
          iconColor: '#f39c12',
          textColor: '#856404'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'notice':
      default:
        return 'ℹ️';
    }
  };

  if (!visible) return null;

  const notificationStyle = getNotificationStyle();

  return (
    <Animated.View 
      style={[
        styles.notificationContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: notificationStyle.backgroundColor,
          borderColor: notificationStyle.borderColor,
          borderLeftColor: notificationStyle.borderLeftColor,
        }
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color: notificationStyle.iconColor }]}>
            {getIcon()}
          </Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={[styles.noticeLabel, { color: notificationStyle.textColor }]}>
            {type.toUpperCase()}:
          </Text>
          <Text style={[styles.messageText, { color: notificationStyle.textColor }]}>
            {message}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={hideNotification}
        >
          <Text style={[styles.closeButtonText, { color: notificationStyle.textColor }]}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const NewAppointmentScreen = ({ doctor = {}, goBack = () => {}, appointments = [], setAppointments = () => {} }) => {
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [showBillScreen, setShowBillScreen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Payment related states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Custom notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'notice'
  });

  // Function to show custom notification
  const showNotification = (message, type = 'notice') => {
    setNotification({
      visible: true,
      message,
      type
    });
  };

  // Function to hide notification
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false
    }));
  };

  // Generate next 7 days for selection
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    setAvailableDates(dates);
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const formatFullDate = (date) => {
    const options = { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setSelectedDate(formatted);
      setSelectedDateObj(selectedDate);
    }
  };

  const handleDateSelect = (date) => {
    const formatted = date.toISOString().split('T')[0];
    setSelectedDate(formatted);
    setSelectedDateObj(date);
  };

  const handleSubmit = () => {
    if (!patientName || !mobile || !selectedDate || !selectedSlot || !selectedGender) {
      showNotification('Please fill all fields and select your preferences', 'error');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      showNotification('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patientName,
      mobile,
      doctorName: doctor.name || 'Dr. Palak Patel',
      specialty: doctor.specialty || 'Surgeon Specialist',
      date: selectedDate,
      dateDisplay: formatFullDate(selectedDateObj),
      slot: selectedSlot,
      gender: selectedGender,
      doctor: {
        ...doctor,
        fee: doctor.fee || '500'
      }
    };

    try {
      setAppointmentDetails(newAppointment);
      showNotification('Appointment details validated successfully!', 'success');
      setTimeout(() => {
        setShowPaymentScreen(true);
      }, 1500);
    } catch (err) {
      showNotification('Something went wrong while booking the appointment.', 'error');
      console.error('Appointment Error:', err);
    }
  };

  const validatePaymentDetails = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        if (!cardNumber || !expiryDate || !cvv) {
          showNotification('Please fill all card details', 'error');
          return false;
        }
        if (cardNumber.length < 16) {
          showNotification('Please enter a valid 16-digit card number', 'error');
          return false;
        }
        if (cvv.length < 3) {
          showNotification('Please enter a valid CVV', 'error');
          return false;
        }
        break;
      case 'upi':
        if (!upiId) {
          showNotification('Please enter your UPI ID', 'error');
          return false;
        }
        if (!upiId.includes('@')) {
          showNotification('Please enter a valid UPI ID', 'error');
          return false;
        }
        break;
      case 'netbanking':
        if (!selectedBank) {
          showNotification('Please select your bank', 'error');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handlePaymentComplete = () => {
    if (!validatePaymentDetails()) {
      return;
    }

    showNotification('Payment details validated successfully!', 'success');
    setTimeout(() => {
      setShowPaymentScreen(false);
      setShowBillScreen(true);
    }, 1500);
  };

  const handleBillConfirm = () => {
    setAppointments([...appointments, appointmentDetails]);
    setShowBillScreen(false);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    
    // Reset form
    setPatientName('');
    setMobile('');
    setSelectedDate('');
    setSelectedDateObj(null);
    setSelectedSlot('');
    setSelectedGender('');
    setSelectedPaymentMethod('card');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setUpiId('');
    setSelectedBank('');
    setAppointmentDetails(null);
    setShowBillScreen(false);
    
    goBack();
  };

  const BillConfirmationScreen = () => {
    const currentDate = new Date().toLocaleDateString('en-GB');
    const consultationFee = appointmentDetails?.doctor?.fee || '500';
    
    return (
      <View style={styles.billContainer}>
        <CustomNotification
          visible={notification.visible}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setShowBillScreen(false);
              setShowPaymentScreen(true);
            }}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Confirmation</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.billContent}>
          <View style={styles.billReceipt}>
            <View style={styles.billHeader}>
              <View style={styles.hospitalIcon}>
                <Text style={styles.hospitalIconText}>🏥</Text>
              </View>
            </View>

            <View style={styles.billInfoSection}>
              <View style={styles.billInfoRow}>
                <Text style={styles.billLabel}>Name:</Text>
                <Text style={styles.billValue}>{appointmentDetails?.patientName}</Text>
              </View>
              <View style={styles.billInfoRow}>
                <Text style={styles.billLabel}>Date:</Text>
                <Text style={styles.billValue}>{currentDate}</Text>
              </View>
            </View>

            <View style={styles.billAddressSection}>
              <View style={styles.billAddressColumn}>
                <Text style={styles.billAddressTitle}>Bill From:</Text>
                <Text style={styles.billAddressText}>
                  {appointmentDetails?.doctor?.hospital || 'K.D Hospital'}
                </Text>
                <Text style={styles.billAddressSubText}>Street Address, Zip Code</Text>
              </View>
              <View style={styles.billAddressColumn}>
                <Text style={styles.billAddressTitle}>Bill TO:</Text>
                <Text style={styles.billAddressText}>Home Town</Text>
                <Text style={styles.billAddressSubText}>Street Address, Zip Code</Text>
              </View>
            </View>

            <View style={styles.billTable}>
              <View style={styles.billTableHeader}>
                <Text style={[styles.billTableHeaderText, { flex: 2 }]}>Item</Text>
                <Text style={[styles.billTableHeaderText, { flex: 1 }]}>Rate</Text>
                <Text style={[styles.billTableHeaderText, { flex: 1 }]}>Tax</Text>
                <Text style={[styles.billTableHeaderText, { flex: 1 }]}>Amount</Text>
              </View>
              
              <View style={styles.billTableRow}>
                <Text style={[styles.billTableCell, { flex: 2 }]}>Consultation Charges</Text>
                <Text style={[styles.billTableCell, { flex: 1 }]}>₹{consultationFee}.00</Text>
                <Text style={[styles.billTableCell, { flex: 1 }]}>₹0.00</Text>
                <Text style={[styles.billTableCell, { flex: 1 }]}>₹{consultationFee}.00</Text>
              </View>
            </View>

            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Terms & Conditions:</Text>
              
              <View style={styles.billSummary}>
                <View style={styles.billSummaryRow}>
                  <Text style={styles.billSummaryLabel}>Subtotal:</Text>
                  <Text style={styles.billSummaryValue}>₹{consultationFee}.00</Text>
                </View>
                <View style={styles.billSummaryRow}>
                  <Text style={styles.billSummaryLabel}>Discount:</Text>
                  <Text style={styles.billSummaryValue}>₹0.00</Text>
                </View>
                <View style={styles.billSummaryRow}>
                  <Text style={styles.billSummaryLabel}>Tax:</Text>
                  <Text style={styles.billSummaryValue}>₹0.00</Text>
                </View>
                <View style={styles.billSummaryRow}>
                  <Text style={styles.billSummaryLabel}>Paid:</Text>
                  <Text style={styles.billSummaryValue}>₹0.00</Text>
                </View>
              </View>

              <View style={styles.billTotal}>
                <Text style={styles.billTotalText}>Total: ₹{consultationFee}.00</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.confirmBillButton}
              onPress={handleBillConfirm}
            >
              <Text style={styles.confirmBillButtonText}>Confirm & Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={handleSuccessModalClose}
    >
      <View style={styles.successModalOverlay}>
        <View style={styles.successModalContainer}>
          <View style={styles.successHeader}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✅</Text>
            </View>
            <Text style={styles.successTitle}>Thank You</Text>
          </View>

          <View style={styles.successContent}>
            <Text style={styles.successMessage}>
              Dear, Your Appointment Schedule on {appointmentDetails?.dateDisplay} at {appointmentDetails?.slot}.
            </Text>

            <View style={styles.bringAllSection}>
              <Text style={styles.bringAllTitle}>Bring all:</Text>
              
              <View style={styles.bringItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.bringItemText}>Prescriptions</Text>
              </View>
              
              <View style={styles.bringItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.bringItemText}>Reports</Text>
              </View>
              
              <View style={styles.bringItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.bringItemText}>Blood Tests</Text>
              </View>
              
              <View style={styles.bringItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <Text style={styles.bringItemText}>X-ray</Text>
              </View>
            </View>

            <Text style={styles.footerNote}>
              If you have any. Reach 15 min. early than Appointment time.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.successOkButton}
            onPress={handleSuccessModalClose}
          >
            <Text style={styles.successOkButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const RadioButton = ({ selected }) => (
    <View style={styles.radioButton}>
      <View style={[styles.radioButtonInner, selected && styles.radioButtonSelected]} />
    </View>
  );

  const PaymentMethodSelector = () => (
    <View style={styles.paymentMethodContainer}>
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      
      <View style={styles.paymentOptionsContainer}>
        <TouchableOpacity
          style={styles.paymentOptionRow}
          onPress={() => setSelectedPaymentMethod('card')}
        >
          <RadioButton selected={selectedPaymentMethod === 'card'} />
          <Text style={styles.paymentOptionIcon}>💳</Text>
          <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOptionRow}
          onPress={() => setSelectedPaymentMethod('upi')}
        >
          <RadioButton selected={selectedPaymentMethod === 'upi'} />
          <Text style={styles.paymentOptionIcon}>📱</Text>
          <Text style={styles.paymentOptionText}>UPI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOptionRow}
          onPress={() => setSelectedPaymentMethod('netbanking')}
        >
          <RadioButton selected={selectedPaymentMethod === 'netbanking'} />
          <Text style={styles.paymentOptionIcon}>🏦</Text>
          <Text style={styles.paymentOptionText}>Net Banking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOptionRow}
          onPress={() => setSelectedPaymentMethod('cash')}
        >
          <RadioButton selected={selectedPaymentMethod === 'cash'} />
          <Text style={styles.paymentOptionIcon}>💵</Text>
          <Text style={styles.paymentOptionText}>Cash on Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <TextInput
              style={styles.paymentInput}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              placeholderTextColor="#999"
              maxLength={16}
            />
            
            <View style={styles.paymentRow}>
              <TextInput
                style={[styles.paymentInput, { flex: 1, marginRight: 10 }]}
                placeholder="Expiry (MM/YY)"
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholderTextColor="#999"
                maxLength={5}
              />
              
              <TextInput
                style={[styles.paymentInput, { flex: 1 }]}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                placeholderTextColor="#999"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        );

      case 'upi':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.sectionTitle}>UPI Details</Text>
            
            <TextInput
              style={styles.paymentInput}
              placeholder="Enter UPI ID (e.g., name@paytm)"
              value={upiId}
              onChangeText={setUpiId}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            
            <View style={styles.upiAppsContainer}>
              <Text style={styles.upiAppsTitle}>Or pay with:</Text>
              <View style={styles.upiAppsRow}>
                <TouchableOpacity style={styles.upiApp}>
                  <Text style={styles.upiAppText}>📱 PhonePe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.upiApp}>
                  <Text style={styles.upiAppText}>💙 Paytm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.upiApp}>
                  <Text style={styles.upiAppText}>🔵 Google Pay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'netbanking':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.sectionTitle}>Select Your Bank</Text>
            
            <View style={styles.bankContainer}>
              {['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'PNB', 'Bank of Baroda', 'Canara Bank', 'Other'].map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={styles.bankOptionRow}
                  onPress={() => setSelectedBank(bank)}
                >
                  <RadioButton selected={selectedBank === bank} />
                  <Text style={styles.bankOptionText}>{bank}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'cash':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.sectionTitle}>Cash Payment</Text>
            <View style={styles.cashPaymentInfo}>
              <Text style={styles.cashInfoIcon}>💵</Text>
              <Text style={styles.cashInfoText}>
                You can pay ₹{appointmentDetails?.doctor?.fee || '500'} in cash at the time of your visit.
              </Text>
            </View>
            <View style={styles.cashNoteContainer}>
              <Text style={styles.cashNote}>
                📌 Please carry exact change to avoid any inconvenience.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const PaymentScreen = () => {
    return (
      <View style={styles.paymentContainer}>
        <CustomNotification
          visible={notification.visible}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowPaymentScreen(false)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.paymentContent}>
          <Text style={styles.paymentTitle}>Complete Your Payment</Text>
          
          <View style={styles.paymentDoctorInfo}>
            <Text style={styles.paymentDoctorName}>{appointmentDetails?.doctorName}</Text>
            <Text style={styles.paymentDoctorSpecialty}>{appointmentDetails?.specialty}</Text>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Date:</Text>
              <Text style={styles.paymentDetailValue}>{appointmentDetails?.dateDisplay}</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Time:</Text>
              <Text style={styles.paymentDetailValue}>{appointmentDetails?.slot}</Text>
            </View>
          </View>

          <View style={styles.paymentAmountContainer}>
            <Text style={styles.paymentAmountLabel}>Total Amount</Text>
            <Text style={styles.paymentAmount}>₹{appointmentDetails?.doctor?.fee || '500'}</Text>
          </View>

          <PaymentMethodSelector />

          {renderPaymentForm()}

          <TouchableOpacity 
            style={styles.payButton}
            onPress={handlePaymentComplete}
          >
            <Text style={styles.payButtonText}>
              {selectedPaymentMethod === 'cash' ? 'Book Appointment' : `Pay ₹${appointmentDetails?.doctor?.fee || '500'}`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  if (showBillScreen) {
    return <BillConfirmationScreen />;
  }

  if (showPaymentScreen) {
    return <PaymentScreen />;
  }

  return (
    <View style={styles.screenContainer}>
      {/* Custom Notification */}
      <CustomNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Doctor Profile Section */}
        <View style={styles.doctorProfile}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.avatarText}>👨‍⚕️</Text>
            </View>
            <View style={styles.doctorBasicInfo}>
              <Text style={styles.doctorName}>{doctor.name || 'Dr. Palak Patel'}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty || 'Surgeon Specialist'}</Text>
              <Text style={styles.doctorEducation}>{doctor.education || 'MBBS,MD'}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>★★★★☆</Text>
                <Text style={styles.rating}>({doctor.rating || '4.5'}) • {doctor.reviews || '200'} reviews</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.doctorDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Experience:</Text>
              <Text style={styles.detailValue}>{doctor.experience || '10+ years'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hospital:</Text>
              <Text style={styles.detailValue}>{doctor.hospital || 'City General Hospital'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Consultation Fee:</Text>
              <Text style={styles.detailValue}>₹{doctor.fee || '500'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Languages:</Text>
              <Text style={styles.detailValue}>{doctor.languages || 'English, Hindi, Gujarati'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Available Days:</Text>
              <Text style={styles.detailValue}>{doctor.availableDays || 'Mon - Sat'}</Text>
            </View>
            
            {doctor.address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>{doctor.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Patient Details Form */}
        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={patientName}
            onChangeText={setPatientName}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number (10 digits)"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor="#999"
          />
        </View>

        {/* Choose Your Slot Section */}
        <Text style={styles.sectionTitle}>Choose your date</Text>
        
        {/* Date Selection */}
        <View style={styles.dateContainer}>
          {availableDates.map((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateKey;
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateButton, isSelected && styles.selectedDate]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
                  {getDayName(date)}
                </Text>
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Alternative Date Picker Button */}
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {selectedDate ? `Selected: ${formatFullDate(selectedDateObj)}` : 'Or pick a custom date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDateObj || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Morning Slots */}
        <Text style={styles.timeLabel}>Morning</Text>
        <View style={styles.slotsContainer}>
          {morningSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slotButton, selectedSlot === slot && styles.selectedSlot]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, selectedSlot === slot && styles.selectedSlotText]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Evening Slots */}
        <Text style={styles.timeLabel}>Evening</Text>
        <View style={styles.slotsContainer}>
          {eveningSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slotButton, selectedSlot === slot && styles.selectedSlot]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, selectedSlot === slot && styles.selectedSlotText]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gender Selection */}
        <Text style={styles.sectionTitle}>Book For</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Female' && styles.selectedGender]}
            onPress={() => setSelectedGender('Female')}
          >
            <Text style={[styles.genderText, selectedGender === 'Female' && styles.selectedGenderText]}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Male' && styles.selectedGender]}
            onPress={() => setSelectedGender('Male')}
          >
            <Text style={[styles.genderText, selectedGender === 'Male' && styles.selectedGenderText]}>Male</Text>
          </TouchableOpacity>
        </View>

        {/* Book Now Button */}
        <View style={styles.bookingFooter}>
          <Text style={styles.feeText}>₹ {doctor.fee || '500'}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={handleSubmit}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <SuccessModal />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Notification styles
  notificationContainer: {
    position: 'absolute',
    top: 80, // Adjust based on your header height
    left: 20,
    right: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: 16,
  },
  messageContainer: {
    flex: 1,
  },
  noticeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a6fa5',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a5a80',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  doctorProfile: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6fa5',
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#4a6fa5',
  },
  avatarText: {
    fontSize: 24,
    color: '#4a6fa5',
  },
  doctorBasicInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  doctorEducation: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#f39c12',
    fontSize: 14,
    marginRight: 5,
  },
  rating: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  doctorDetails: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#4a6fa5',
    width: 120,
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    color: '#34495e',
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    minWidth: 45,
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: '#4a6fa5',
    borderColor: '#4a6fa5',
  },
  dayText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  selectedDateText: {
    color: '#fff',
  },
  datePickerButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#bbdefb',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 14,
    color: '#4a6fa5',
    fontWeight: '500',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginTop: 10,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  slotButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    width: '48%',
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  slotText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  selectedSlotText: {
    color: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  genderButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    width: '48%',
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#e84393',
    borderColor: '#e84393',
  },
  genderText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
  },
  bookingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#e84393',
  },
  feeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  bookButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxWidth: 320,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successIconText: {
    fontSize: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  successContent: {
    padding: 25,
    paddingTop: 15,
  },
  successMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  bringAllSection: {
    marginBottom: 20,
  },
  bringAllTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  bringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  bringItemText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  footerNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  successOkButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    marginHorizontal: 25,
    marginBottom: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  successOkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Payment Screen Styles
  paymentContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  paymentContent: {
    padding: 20,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  paymentDoctorInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentDoctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  paymentDoctorSpecialty: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paymentDetailLabel: {
    fontWeight: '600',
    color: '#4a6fa5',
    width: 80,
    fontSize: 14,
  },
  paymentDetailValue: {
    flex: 1,
    color: '#34495e',
    fontSize: 14,
  },
  paymentAmountContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  paymentAmountLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  // Radio Button Styles
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a6fa5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: '#4a6fa5',
  },
  
  // Payment Method Styles with Radio Buttons
  paymentMethodContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentOptionsContainer: {
    marginTop: 10,
  },
  paymentOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  paymentOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  
  paymentForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // UPI Styles
  upiAppsContainer: {
    marginTop: 15,
  },
  upiAppsTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  upiAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upiApp: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    width: '30%',
    alignItems: 'center',
  },
  upiAppText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  
  // Bank Styles with Radio Buttons
  bankContainer: {
    marginTop: 10,
  },
  bankOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  bankOptionText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
  },
  
  // Cash Payment Styles
  cashPaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  cashInfoIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  cashInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  cashNoteContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  cashNote: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Bill Confirmation Screen Styles
  billContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  billContent: {
    padding: 20,
  },
  billReceipt: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  billHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hospitalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  hospitalIconText: {
    fontSize: 24,
  },
  billInfoSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  billInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  billLabel: {
    fontWeight: 'bold',
    color: '#2c3e50',
    width: 60,
    fontSize: 14,
  },
  billValue: {
    flex: 1,
    color: '#34495e',
    fontSize: 14,
  },
  billAddressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  billAddressColumn: {
    flex: 1,
  },
  billAddressTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
  },
  billAddressText: {
    fontSize: 13,
    color: '#34495e',
    marginBottom: 4,
    fontWeight: '500',
  },
  billAddressSubText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  billTable: {
    marginBottom: 20,
  },
  billTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  billTableHeaderText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#2c3e50',
    textAlign: 'center',
  },
  billTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  billTableCell: {
    fontSize: 13,
    color: '#34495e',
    textAlign: 'center',
  },
  termsSection: {
    marginBottom: 20,
  },
  termsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 15,
  },
  billSummary: {
    marginBottom: 15,
  },
  billSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  billSummaryLabel: {
    fontSize: 13,
    color: '#34495e',
  },
  billSummaryValue: {
    fontSize: 13,
    color: '#34495e',
    fontWeight: '500',
  },
  billTotal: {
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  billTotalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmBillButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmBillButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewAppointmentScreen;