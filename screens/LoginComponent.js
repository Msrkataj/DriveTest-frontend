import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';  // Zastępuje `useRouter` w React Native
import {colors, fonts} from '../styles/variables'; // Import zmiennych
import {globalStyles} from '../styles/globalStyles'; // Import stylów globalnych
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


const LoginComponent = () => {
    const [licenseNumber, setLicenseNumber] = useState('');
    const [applicationRef, setApplicationRef] = useState('');
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);  // Stan ładowania

    const handleFindTest = async () => {
        const validationErrors = {};
        if (!licenseNumber)
            validationErrors.licenseNumber = 'Driving license number is required.';
        if (!applicationRef)
            validationErrors.applicationRef = 'Application ref. / Theory test no. is required.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);  // Ustaw ładowanie na true przed zapytaniem

        const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';

        try {
            const response = await fetch(`${serverUrl}/api/saveUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ licenseNumber, applicationRef }),
            });

            const data = await response.json();


     if (response.ok) {
                  await AsyncStorage.setItem('userData', JSON.stringify(data.user));

                  const user = data.user;

                  if (user.extendedTest && user.specialRequirements) {
                      if (user.isPremium) {
                          navigation.navigate('HomeModule'); // Przejdź do HomeModule, jeśli isPremium jest true
                      } else {
                          navigation.navigate('OfferSelection'); // Przejdź do OfferSelection, jeśli isPremium jest false
                      }
                  } else {
                      navigation.navigate('TestSelection'); // Przejdź do TestSelection, jeśli extendedTest lub specialRequirements nie są ustawione
                  }
              } else {
                  if (response.status === 400) {
                      setErrors({ general: data.message });
                  } else {
                      setErrors({ general: data.message || 'An error occurred. Please try again.' });
                  }
              }
        } catch (error) {
            console.error('Error:', error);
            setErrors({
                general: 'Network error. Please check your connection and try again.',
            });
        } finally {
            setLoading(false);  // Ustaw ładowanie na false po zakończeniu zapytania
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginImage}>
                <Image
                    source={require('../assets/driving-rafiki.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.loginMain}>
                <Text style={styles.loginLabel}>Driving license number</Text>
                <TextInput
                    style={styles.loginInput}
                    placeholder="Type here..."
                    value={licenseNumber}
                    onChangeText={(text) => setLicenseNumber(text)}
                />
                {errors.licenseNumber && (
                    <Text style={styles.errorMessage}>{errors.licenseNumber}</Text>
                )}

                <Text style={styles.loginLabel}>                    Application ref. / Theory test no.

                </Text>
                <TextInput
                    style={styles.loginInput}
                    placeholder="Type here..."
                    value={applicationRef}
                    onChangeText={(text) => setApplicationRef(text)}
                />
                {errors.applicationRef && (
                    <Text style={styles.errorMessage}>{errors.applicationRef}</Text>
                )}

                {/* Wyświetlanie błędów ogólnych */}
                {errors.general && (
                    <Text style={styles.errorMessage}>{errors.general}</Text>
                )}
                   {/* Wskaźnik ładowania */}
                                {loading && (
                                    <ActivityIndicator size="large" color={colors.main} style={styles.loader} />
                                )}
            </View>
            <View style={styles.loginButtonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleFindTest}>
                    <Text style={styles.buttonText}>Find me a test</Text>
                    <View style={styles.dragHandle}>
                        <Text style={styles.arrow}>&rarr;</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',  // Wyśrodkowanie w pionie
        alignItems: 'center',  // Wyśrodkowanie w poziomie
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    loginImage: {
        width: '100%',
        height: 300,
        marginBottom: 30,
    },
    loginMain: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
    },
    loginLabel: {
        fontSize: 14,
        fontWeight: '600',  // Pogrubienie tekstu
        color: colors.black,
        alignSelf: 'flex-start',
    },
    loginInput: {
        width: '100%',
        maxWidth: 300,
        padding: 12,
        borderColor: colors.black2,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        color: 'black',
    },
    loginButtonContainer: {
        width: '100%',
        alignItems: 'center',  // Wyśrodkowanie przycisku
        marginTop: 50,
    },
    loginButton: {
        backgroundColor: colors.main,
        width: 280,
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,  // Zmniejszenie paddingu, aby kółko mogło być bliżej końca
    },
    buttonText: {
        fontWeight: '600',
        color: colors.white,
        flexGrow: 1,
        textAlign: 'left',
        marginLeft: 10,  // Dodatkowy margines, aby tekst nie był zbyt blisko lewej strony
    },
    dragHandle: {
        position: 'absolute',  // Ustawiamy pozycję absolutną
        right: -15,  // Kółko lekko wychodzi poza niebieski przycisk
        width: 60,
        height: 60,
        backgroundColor: colors.white,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    arrow: {
        fontSize: 24,  // Rozmiar strzałki
        color: colors.main,
        textAlign: 'center',  // Upewnij się, że strzałka jest wyśrodkowana
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default LoginComponent;