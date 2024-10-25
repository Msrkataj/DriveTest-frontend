// screens/TestSelection.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/variables'; // Importuj swoje zmienne kolorów
import { Platform } from 'react-native';

// Definicja testTypes
const testTypes = [
  {
    id: 1,
    name: 'Car (manual and automatic)',
    icon: require('../assets/sports-car.png'),
  },
  {
    id: 2,
    name: 'Motorcycles',
    icon: require('../assets/motorcycle-icon.png'),
  },
  {
    id: 3,
    name: 'Lorries',
    icon: require('../assets/lorry.png'),
  },
  {
    id: 4,
    name: 'Buses and coaches',
    icon: require('../assets/bus.png'),
  },
];

const TestSelection = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const navigation = useNavigation();

  const handleSelect = (test) => {
    setSelectedTest(test);
  };

  const handleContinue = async () => {
        const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';

    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'User data not found in storage');
        return;
      }

      const parsedData = JSON.parse(userData);
      const { licenseNumber } = parsedData;

      const response = await fetch(`${serverUrl}/api/updateUserTest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNumber, selectedTestId: selectedTest.id }),
      });

      if (response.ok) {
        console.log('User test type updated successfully');
        navigation.navigate('LicenseDetails');  // Przejdź do kolejnego ekranu
      } else {
        console.error('Failed to update user test type');
        Alert.alert('Error', 'Failed to update user test type');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Choose type of test</Text>
        <View style={styles.options}>
          {testTypes.map((test) => (
              <TouchableOpacity
                  key={test.id}
                  style={[
                    styles.option,
                    selectedTest?.id === test.id && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(test)}
              >
                <Image source={test.icon} style={styles.optionIcon} />
                <Text
                    style={[
                      styles.optionText,
                      selectedTest?.id === test.id && styles.selectedOptionText,
                    ]}
                >
                  {test.name}
                </Text>
              </TouchableOpacity>
          ))}
        </View>
        <View style={styles.continueContainer}>
          {selectedTest ? (
              <TouchableOpacity
                  style={[styles.button, styles.buttonActive]}
                  onPress={handleContinue}
              >
                <Text style={styles.buttonTextActive}>Continue</Text>
                <View style={styles.dragHandle}>
                  <Text style={styles.arrow}>&rarr;</Text>
                </View>
              </TouchableOpacity>
          ) : (
              <View style={[styles.button, styles.buttonDisabled]}>
                <Text style={styles.buttonTextDisabled}>Choose to continue</Text>
                <View style={styles.dragHandleDisabled}>
                  <Text style={styles.arrowDisabled}>&rarr;</Text>
                </View>
              </View>
          )}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
                    color: 'black',

    fontWeight: 'bold',
    marginBottom: 20,
  },
  options: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: colors.main,
    borderColor: colors.main,
  },
  optionText: {
    marginLeft: 10,
    flex: 1,
    textAlign: 'left',
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  optionIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  continueContainer: {
    marginTop: 'auto',
    paddingBottom: 50,
  },
  button: {
    position: 'relative',
    width: 300,
    height: 50,
    backgroundColor: colors.white,
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
    backgroundColor: 'rgba(3, 71, 255, 0.1)',
  },
  buttonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: 'rgba(3, 71, 255, 0.4)',
    fontWeight: '600',
  },
  dragHandle: {
    position: 'relative',
    zIndex: 2,
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 20,
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
    color: 'rgba(3, 71, 255, 0.4)',
  },
});

export default TestSelection;
