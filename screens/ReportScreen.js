import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid, Platform } from 'react-native';

const ReportScreen = ({ goBack }) => {
  const handleExportPDF = async () => {
    try {
      // Ask for permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download the PDF',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission not granted');
          return;
        }
      }

      const htmlContent = `
        <h1 style="text-align:center;">HAEMATOLOGY</h1>
        <h2 style="text-align:center;">COMPLETE BLOOD COUNT (CBC)</h2>
        <h3>Patient Info</h3>
        <p><b>Name:</b> Mr Dummy</p>
        <p><b>Age/Gender:</b> 20 / Male</p>
        <p><b>Referred By:</b> Self</p>
        <p><b>Phone No.:</b> -</p>
        <p><b>Patient ID:</b> PN2</p>
        <p><b>Report ID:</b> RE1</p>
        <p><b>Collection Date:</b> 24/06/2023 08:49 PM</p>
        <p><b>Report Date:</b> 24/06/2023 09:02 PM</p>
        <hr/>
        <h3>Test Results</h3>
        <p><b>Haemoglobin:</b> 15 (13 - 17 g/dL)</p>
        <p><b>Total Leucocyte Count:</b> 5000 (4000 - 10000 /cumm)</p>
        <p><b>Neutrophils:</b> 50 (40 - 80 %)</p>
        <p><b>Lymphocytes:</b> 40 (20 - 40 %)</p>
        <p><b>Monocytes:</b> 9 (2 - 10 %)</p>
        <p><b>Absolute Neutrophils:</b> 2500 (2000 - 7000 /cumm)</p>
        <p><b>Platelet Count:</b> 300000 (150000 - 410000 /cumm)</p>
        <br/>
        <p>... and more values ...</p>
      `;

      const options = {
        html: htmlContent,
        fileName: 'Medical_Report',
        directory: 'Download',
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF saved to: ${file.filePath}`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      Alert.alert('Error', 'Failed to export PDF');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>HAEMATOLOGY</Text>
      <Text style={styles.subtitle}>COMPLETE BLOOD COUNT (CBC)</Text>

      <View style={styles.patientInfo}>
        {renderInfoRow('Name', 'Mr Dummy')}
        {renderInfoRow('Age/Gender', '20 / Male')}
        {renderInfoRow('Referred By', 'Self')}
        {renderInfoRow('Phone No.', '-')}
        {renderInfoRow('Patient ID', 'PN2')}
        {renderInfoRow('Report ID', 'RE1')}
        {renderInfoRow('Collection Date', '24/06/2023 08:49 PM')}
        {renderInfoRow('Report Date', '24/06/2023 09:02 PM')}
      </View>

      <Text style={styles.sectionTitle}>Test Results</Text>
      {renderTableRow('Haemoglobin', '15', '13 - 17', 'g/dL')}
      {renderTableRow('Total Leucocyte Count', '5000', '4000 - 10000', '/cumm')}
      <Text style={styles.sectionHeader}>Differential Leucocyte Count</Text>
      {renderTableRow('Neutrophils', '50', '40 - 80', '%')}
      {renderTableRow('Lymphocytes', '40', '20 - 40', '%')}
      {renderTableRow('Eosinophils', '1', '1 - 6', '%')}
      {renderTableRow('Monocytes', '9', '2 - 10', '%')}
      {renderTableRow('Basophils', '0.00', '0 - 1', '%')}
      <Text style={styles.sectionHeader}>Absolute Leucocyte Count</Text>
      {renderTableRow('Absolute Neutrophils', '2500.00', '2000 - 7000', '/cumm')}
      {renderTableRow('Absolute Lymphocytes', '2000.00', '1000 - 3000', '/cumm')}
      {renderTableRow('Absolute Eosinophils', '50.00', '20 - 500', '/cumm')}
      {renderTableRow('Absolute Monocytes', '450.00', '200 - 1000', '/cumm')}
      <Text style={styles.sectionHeader}>RBC Indices</Text>
      {renderTableRow('RBC Count', '5', '4.5 - 5.5', 'Million/cumm')}
      {renderTableRow('MCV', '80.00', '81 - 101', 'fL')}
      {renderTableRow('MCH', '30.00', '27 - 32', 'pg')}
      {renderTableRow('MCHC', '37.50', '31.5 - 34.5', 'g/dL')}
      {renderTableRow('Hct', '40', '40 - 50', '%')}
      {renderTableRow('RDW-CV', '12', '11.6 - 14.0', '%')}
      {renderTableRow('RDW-SD', '36', '34 - 46', 'fL')}
      <Text style={styles.sectionHeader}>Platelets Indices</Text>
      {renderTableRow('Platelet Count', '300000', '150000 - 410000', '/cumm')}
      {renderTableRow('PCT', '35', '-', '%')}
      {renderTableRow('MPV', '8', '7.5 - 11.5', 'fL')}
      {renderTableRow('PDW', '9', '-', 'fL')}

      <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
        <Text style={styles.exportButtonText}>Export as PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderInfoRow = (label, value) => (
  <Text style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text> {value}
  </Text>
);

const parseRange = (range) => {
  const parts = range.split('-').map(p => parseFloat(p.trim()));
  return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts : [NaN, NaN];
};

const renderTableRow = (test, result, range, unit) => {
  const [min, max] = parseRange(range);
  const numericResult = parseFloat(result);
  let color = '#000';

  if (!isNaN(min) && !isNaN(max) && !isNaN(numericResult)) {
    if (numericResult < min) color = 'blue';
    else if (numericResult > max) color = 'red';
  }

  return (
    <View style={styles.row}>
      <Text style={styles.cellTest}>{test}</Text>
      <Text style={[styles.cell, { color }]}>{result}</Text>
      <Text style={styles.cell}>{range}</Text>
      <Text style={styles.cell}>{unit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  backText: {
    fontSize: 14, // Reduced from 16 to make the arrow smaller
    color: '#007AFF',
    marginBottom: 20,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 20,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  patientInfo: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    fontSize: 16,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#495057',
  },
  sectionTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderColor: '#007AFF',
    paddingBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '700',
    color: '#495057',
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cellTest: {
    flex: 2.2,
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  cell: {
    flex: 1.1,
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  exportButton: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#28a745',
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default ReportScreen;