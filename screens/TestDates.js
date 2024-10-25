import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform } from 'react-native';

const testDays = [
    { day: 'Monday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
    { day: 'Tuesday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
    { day: 'Wednesday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
    { day: 'Thursday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
    { day: 'Friday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
    { day: 'Saturday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
    { day: 'Sunday', times: ['7:00-9:00 (AM)', '9:00-12:00 (AM)', '12:00-4:30 (PM)', '4:30 and above (PM)'] },
];

const TestDates = () => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState({});
    const navigation = useNavigation();

    const handleDaySelect = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day)
                ? prev.filter(selectedDay => selectedDay !== day)
                : [...prev, day]
        );
    };


    const handleTimeSelect = (day, time) => {
        setSelectedTimes((prev) => ({
            ...prev,
            [day]: prev[day] && prev[day].includes(time)
                ? prev[day].filter(selectedTime => selectedTime !== time)
                : [...(prev[day] || []), time],
        }));
    };


    const handleSaveAvailability = async () => {
        const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';

        try {
            // Pobierz dane użytkownika z AsyncStorage
            const userData = await AsyncStorage.getItem('userData');

            if (!userData) {
                Alert.alert('Error', 'User data not found in storage');
                return;
            }

            const parsedUserData = JSON.parse(userData);
            const { licenseNumber } = parsedUserData;

            // Aktualizuj dane użytkownika
            const updatedUserData = {
                ...parsedUserData,
                availability: selectedTimes,
            };

            // Zapisz zaktualizowane dane w AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

            // Wyślij dane do API
            const response = await fetch(`${serverUrl}/api/updateUserAvailability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ licenseNumber, availability: updatedUserData.availability }),
            });

            if (response.ok) {
                console.log('Availability saved successfully');
                navigation.navigate('EmailNotification'); // Przejdź do kolejnego ekranu
            } else {
                console.error('Failed to save availability');
                Alert.alert('Error', 'Failed to save availability');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };
    const renderCheckbox = (isSelected) => {
        return (
            <View style={styles.checkbox}>
                {isSelected ? (
                    <Icon name="check-circle" size={24} color="#0347FF" />
                ) : (
                    <Icon name="circle-thin" size={24} color="#bbb" />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test dates</Text>
            <Text style={styles.subtitle}>Mark your availability for autobook</Text>
            <ScrollView style={styles.datesList}>
                {testDays.map((testDay, index) => (
                    <View key={index}>
                        <TouchableOpacity
                            style={[
                                styles.dayItem,
                                selectedDays.includes(testDay.day)
                            ]}
                            onPress={() => handleDaySelect(testDay.day)}
                        >
                            <View style={styles.checkboxContainer}>
                                {renderCheckbox(selectedDays.includes(testDay.day))}
                                <Text style={styles.dayText}>{testDay.day}</Text>
                            </View>
                        </TouchableOpacity>
                        {selectedDays.includes(testDay.day) && (
                            <View style={styles.timesList}>
                                {testDay.times.map((time, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[
                                            styles.timeItem,
                                            selectedTimes[testDay.day] && selectedTimes[testDay.day].includes(time) && styles.selectedTimeItem,
                                        ]}
                                        onPress={() => handleTimeSelect(testDay.day, time)}
                                    >
                                        <View style={styles.checkboxContainer}>
                                            {renderCheckbox(selectedTimes[testDay.day] && selectedTimes[testDay.day].includes(time))}
                                            <Text style={styles.timeText}>{time}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                {selectedDays.length === 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('Email')}>
                        <Text style={styles.skipLink}>Skip for now</Text>
                    </TouchableOpacity>
                )}
                {selectedDays.length > 0 && Object.keys(selectedTimes).length > 0 && (
                    <View style={styles.continueButtonContainer}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleSaveAvailability}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                            <View style={styles.dragHandle}>
                                <Text style={styles.arrow}>&rarr;</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#7d7d7d',
        marginBottom: 20,
    },
    datesList: {
        flex: 1,
    },
    dayItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    selectedDayItem: {
        backgroundColor: 'rgba(3, 71, 255, 0.1)',
    },
    dayText: {
        fontSize: 16,
                        color: 'black',
        fontWeight: '600',
    },
    timesList: {
        paddingLeft: 20,
        marginTop: 10,
    },
    timeItem: {
        paddingVertical: 10,
                color: 'black',

    },
    selectedTimeItem: {
        backgroundColor: 'rgba(3, 71, 255, 0.2)',
    },
    disabledTimeItem: {
        opacity: 0.5,
    },
    timeText: {
        fontSize: 14,
        color: '#7d7d7d',
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    skipLink: {
        color: '#0347FF',
        fontSize: 16,
        marginBottom: 20,
    },
    continueButtonContainer: {
        alignItems: 'center',
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 300,
        height: 50,
        backgroundColor: '#0347FF',
        borderRadius: 30,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    dragHandle: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        color: '#0347FF',
        fontSize: 16,
    },
});

export default TestDates;
