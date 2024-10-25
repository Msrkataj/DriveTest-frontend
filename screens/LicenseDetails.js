// screens/LicenseDetails.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/variables'; // Import Twoich zmiennych kolorów
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const LicenseDetails = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [extendedTest, setExtendedTest] = useState(null);
  const [specialRequirements, setSpecialRequirements] = useState(null);
  const navigation = useNavigation();

  const isFormComplete =
      extendedTest !== null && specialRequirements !== null;

  const handleSubmit = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log('Pobrane dane z AsyncStorage:', userData);

      if (!userData) {
        Alert.alert('Error', 'User data not found in storage');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const { licenseNumber } = parsedUserData;

      if (!licenseNumber) {
        Alert.alert('Error', 'License number not found in user data');
        return;
      }

      const updatedUserData = {
        ...parsedUserData,
        extendedTest,
        specialRequirements,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

        const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';

      const response = await fetch(`${serverUrl}/api/updateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNumber, extendedTest, specialRequirements }),
      });

      const responseText = await response.text();

      console.log('Response status:', response.status);
      console.log('Response body:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse response as JSON:', error);
        Alert.alert('Error', 'Failed to parse server response. Please try again.');
        return;
      }

      if (response.ok) {
        console.log('User data saved successfully');
        navigation.navigate('OfferSelection');
      } else {
        console.error('Failed to save user data', data.message);
        Alert.alert('Error', data.message || 'Failed to save user data');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>License details</Text>
      <Text style={styles.subtitle}>Car test</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Have you been ordered by a court to take an extended test?
        </Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioOption,
              extendedTest === 'no' && styles.selectedOption,
            ]}
            onPress={() => setExtendedTest('no')}
          >
            <Text
              style={[
                styles.radioText,
                extendedTest === 'no' && styles.selectedOptionText,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioOption,
              extendedTest === 'yes' && styles.selectedOption,
            ]}
            onPress={() => setExtendedTest('yes')}
          >
            <Text
              style={[
                styles.radioText,
                extendedTest === 'yes' && styles.selectedOptionText,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Do you have any special requirements?
        </Text>
        <Text style={styles.smallText}>
          (disabilities or conditions, pregnancy, Welsh speaking examiner)
        </Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioOption,
              specialRequirements === 'no' && styles.selectedOption,
            ]}
            onPress={() => setSpecialRequirements('no')}
          >
            <Text
              style={[
                styles.radioText,
                specialRequirements === 'no' && styles.selectedOptionText,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioOption,
              specialRequirements === 'yes' && styles.selectedOption,
            ]}
            onPress={() => setSpecialRequirements('yes')}
          >
            <Text
              style={[
                styles.radioText,
                specialRequirements === 'yes' && styles.selectedOptionText,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.continueContainer}>
        {isFormComplete ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonActive]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonTextActive}>Continue</Text>
            <View style={styles.dragHandle}>
              <Text style={styles.arrow}>&rarr;</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.button, styles.buttonDisabled]}>
            <Text style={styles.buttonTextDisabled}>Fill to continue</Text>
            <View style={styles.dragHandleDisabled}>
              <Text style={styles.arrowDisabled}>&rarr;</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default LicenseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
            color: 'black',
  },
  subtitle: {
    color: '#7d7d7d',
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
            color: 'black',

  },
  formGroup: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.main3,
    marginBottom: 10,
  },
  smallText: {
    fontSize: 12,
    color: colors.main3,
    marginBottom: 5,
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 14,
            color: 'black',

  },
  radioGroup: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
            color: 'black',

  },
  radioText: {
    fontSize: 14,
    color: colors.main3,
  },
  selectedOption: {
    // Dodatkowe stylizacje dla wybranej opcji
  },
  selectedOptionText: {
    color: colors.main,
    fontWeight: 'bold',
  },
  continueContainer: {
    marginTop: 'auto',
    paddingBottom: 50,
  },
  button: {
    position: 'relative',
    width: 300,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonActive: {
    backgroundColor: colors.main,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(3, 71, 255, 0.2)',
  },
  buttonTextActive: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextDisabled: {
    color: '#999',
    fontSize: 16,
  },
  dragHandle: {
    position: 'absolute',
    right: -15,
    width: 60,
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  dragHandleDisabled: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  arrow: {
    fontSize: 16,
    color: colors.main,
  },
  arrowDisabled: {
    fontSize: 16,
    color: colors.main3,
  },
});
