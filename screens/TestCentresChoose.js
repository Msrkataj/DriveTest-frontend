import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TestCentres = () => {
    const [testCentres, setTestCentres] = useState([]);
    const [filteredCentres, setFilteredCentres] = useState([]);
    const [selectedCentres, setSelectedCentres] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDetails, setShowDetails] = useState({});
    const navigation = useNavigation();

    // Fetchowanie test centres z bazy danych i pobieranie wybranych centrów z MongoDB
    useEffect(() => {
        const fetchTestCentres = async () => {
        const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';

            try {
                const response = await fetch(`${serverUrl}/api/testCentres`);
                const data = await response.json();
                setTestCentres(data);
                setFilteredCentres(data);

                const userData = await AsyncStorage.getItem('userData');
                if (!userData) {
                    Alert.alert('Error', 'User data not found');
                    return;
                }

                const { licenseNumber } = JSON.parse(userData);

                const userResponse = await fetch(`${serverUrl}/api/getUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ licenseNumber }),
                });

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    setSelectedCentres(user.selectedCentres || []);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching test centres or user data:', error);
                Alert.alert('Error', 'Failed to fetch data');
            }
        };

        fetchTestCentres();
    }, []);

    // Filtrowanie centrów na podstawie zapytania
    useEffect(() => {
        const filtered = testCentres.filter((centre) => {
            const name = centre.name || '';
            const postalCode = centre.postalCode || '';
            return (
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                postalCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredCentres(filtered);
    }, [searchQuery, testCentres]);

    const handleSelect = (centreName) => {
        setSelectedCentres((prev) =>
            prev.includes(centreName)
                ? prev.filter((item) => item !== centreName)
                : [...prev, centreName]
        );
    };

    const toggleDetails = (index) => {
        setShowDetails((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSave = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                Alert.alert('Error', 'User data not found');
                return;
            }

            const { licenseNumber } = JSON.parse(userData);

            // Aktualizacja centrów w MongoDB
            const response = await fetch('https://drive-test-3bee5c1b0f36.herokuapp.com/api/updateUserCentres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ licenseNumber, selectedCentres }),
            });

            if (response.ok) {
                console.log('Selected centres saved successfully');
                navigation.navigate('HomeModule'); // Przejdź do strony HomeModule
            } else {
                console.error('Failed to save selected centres');
                Alert.alert('Error', 'Failed to save selected centres');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.centreItem}>
            <TouchableOpacity
                style={styles.centreLabel}
                onPress={() => handleSelect(item.name)}
            >
                <Text
                    style={[
                        styles.centreName,
                        selectedCentres.includes(item.name) && styles.selectedText,
                    ]}
                >
                    {item.name}
                </Text>
                <Icon
                    name="location-arrow"
                    size={20}
                    color="#0347FF"
                    onPress={() => toggleDetails(index)}
                />
            </TouchableOpacity>
            {showDetails[index] && (
                 <View style={styles.centreDetails}>
                                  <Text style={styles.text}>{item.address}</Text>
                                  <Text style={styles.text}>{item.postalCode}</Text>
                              </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test centres</Text>
            <Text style={styles.subtitle}>Choose your test centres</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBox}
                    placeholder="Search test centres or type post code"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
            </View>
            <FlatList
                data={filteredCentres}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                style={styles.centresList}
            />
            {selectedCentres.length > 0 && (
                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                        <View style={styles.dragHandle}>
                            <Text style={styles.arrow}>&rarr;</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
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
    searchContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    searchBox: {
        padding: 10,
        paddingLeft: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        fontSize: 14,
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        top: 12,
    },
    centresList: {
        flex: 1,
    },
    centreItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    centreLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    centreName: {
        fontSize: 16,
        fontWeight: '600',
                color: 'black',

    },
    selectedText: {
        color: '#0347FF',
    },
    centreDetails: {
        marginTop: 10,
        paddingLeft: 10,
                color: 'black',

    },
       text: {
                    color: 'black',
        },
    saveButtonContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButton: {
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

export default TestCentres;
