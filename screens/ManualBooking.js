import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ManualBooking = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Funkcja, która automatycznie uzupełni formularz po stronie Puppeteer
 // Funkcja do automatycznego wypełnienia formularza po stronie Puppeteer
 const handleBookNow = async () => {
     try {
         const userData = await AsyncStorage.getItem('userData');
         const parsedUserData = JSON.parse(userData);
         const { _id: userId } = parsedUserData;

         const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com'; // Adres twojego serwera
         const response = await fetch(`${serverUrl}/api/cheerio/fillForm`, { // Zmieniona ścieżka
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ userId }),
         });

         const responseText = await response.text();
         console.log('Response text:', responseText);

         let result;
         try {
             result = JSON.parse(responseText);
         } catch (error) {
             console.error('Failed to parse response as JSON:', error);
             Alert.alert('Error', 'Failed to parse server response. Please check server logs.');
             return;
         }

         if (response.ok) {
             Alert.alert('Success', 'Form filled successfully!');
         } else {
             console.error('Failed to fill form', result.message);
             Alert.alert('Error', result.message || 'Failed to fill the form');
         }
     } catch (error) {
         console.error('Error:', error);
         Alert.alert('Error', 'An error occurred.');
     }
 };

 // Funkcja do pobrania danych użytkownika (terminów rezerwacji)
 const fetchBookings = async () => {
     try {
         const userData = await AsyncStorage.getItem('userData');
         const parsedUserData = JSON.parse(userData);
         const { _id: userId } = parsedUserData;

         const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';
         const response = await fetch(`${serverUrl}/api/cheerio/getUserBookings`, { // Zmieniona ścieżka
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ userId }),
         });

         const result = await response.json();

         if (response.ok) {
             setBookings(result.bookings || []); // Ustaw terminy rezerwacji
         } else {
             console.error('Failed to fetch bookings', result.message);
             Alert.alert('Error', result.message || 'Failed to fetch bookings');
         }
     } catch (error) {
         console.error('Error:', error);
         Alert.alert('Error', 'An error occurred. Please try again.');
     } finally {
         setLoading(false);
     }
 };

 // Wywołanie handleBookNow, gdy komponent zostanie załadowany
 useEffect(() => {
     handleBookNow();  // Automatyczne wywołanie funkcji po załadowaniu komponentu
     fetchBookings();  // Pobranie terminów rezerwacji
 }, []);


    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/left.png')}
                        style={styles.topNotificationMenu}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.title}>Manual booking</Text>
                    <Text style={styles.subtitle}>Dates for you</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {bookings.map((booking, index) => (
                    <View key={index} style={styles.item}>
                        <View style={styles.location}>
                            <Text style={styles.locationText}>{booking.location}</Text>
                            <Image
                                source={require('../assets/navigation.png')}
                                style={styles.topNotificationMenu}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.found}>Test centre</Text>
                        <Text style={styles.date}>{booking.date}</Text>
                        <Text style={styles.found}>Date</Text>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Book now</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        color: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 10,
        color: 'black',
    },
    backButton: {
        marginLeft: 10,
    },
    headerTitles: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    title: {
        fontSize: 18,
        color: '#7d7d7d',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: '600',
        textAlign: 'center',
    },
    list: {
        padding: 20,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 40,
        paddingHorizontal: 20,
        marginBottom: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    locationText: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000',
    },
    location: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
    },
    date: {
        color: '#0347FF',
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 16,
    },
    found: {
        fontSize: 14,
        color: '#7d7d7d',
    },
    button: {
        backgroundColor: '#0347FF',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
        position: 'absolute',
        bottom: -20,
        left: '50%',
        transform: [{ translateX: -50 }],
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ManualBooking;
