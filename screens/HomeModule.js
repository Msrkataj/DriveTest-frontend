// screens/HomeModule.js

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BookingIcon from '../assets/booking.svg'; // Użycie SVG jako komponentu
import { Platform } from 'react-native';

const HomeModule = () => {
    const [notifications, setNotifications] = useState([]);
    const [topNotification, setTopNotification] = useState(null);
    const [bottomNotifications, setBottomNotifications] = useState([]);
    const [showSupportMessage, setShowSupportMessage] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchNotifications = async () => {
        const serverUrl = 'https://drive-test-3bee5c1b0f36.herokuapp.com';

            try {
                const response = await fetch(`${serverUrl}/api/notifications`);
                const data = await response.json();

                setNotifications(data);

                const unreadNotification = data.find((notification) => !notification.read);
                setTopNotification(unreadNotification);

                setBottomNotifications([...data].reverse());
            } catch (error) {
                console.error('Błąd podczas pobierania powiadomień:', error);
                Alert.alert('Error', 'Failed to fetch notifications');
            }
        };

        fetchNotifications();
    }, []);

   useEffect(() => {
       let timer;
       if (topNotification && !showSupportMessage) {
           timer = setTimeout(async () => {
               try {
                   await fetch('https://drive-test-3bee5c1b0f36.herokuapp.com/api/notifications/update', {
                       method: 'POST',
                       headers: {
                           'Content-Type': 'application/json',
                       },
                       body: JSON.stringify({
                           text: topNotification.text,
                           date: topNotification.date,
                       }),
                   });

                   setNotifications((prev) =>
                       prev.map((notification) =>
                           notification.text === topNotification.text &&
                           notification.date === topNotification.date
                               ? { ...notification, read: true }
                               : notification
                       )
                   );

                   setTopNotification(null);

                   setBottomNotifications((prev) => [...prev].reverse());

                   const nextUnread = notifications.find((notification) => !notification.read);
                   setTopNotification(nextUnread || null);
               } catch (error) {
                   console.error('Error updating notification:', error);
               }
           }, 3000);
       }

       return () => clearTimeout(timer);
   }, [topNotification, showSupportMessage, notifications]);

    const navigateTo = (screenName) => {
        navigation.navigate(screenName);
    };

    const renderNotification = ({ item }) => (
        <View style={styles.notification}>
            <Image
                source={require('../assets/calendar.png')}
                style={styles.notificationIcon}  // Użycie stylu dla obrazka
                resizeMode="contain"
            />
            <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>{item.text}</Text>
                <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Driving Test Dates</Text>
                <TouchableOpacity onPress={() => navigateTo('Settings')}>
                    <Image
                        source={require('../assets/bars-staggered.png')}
                        style={styles.topNotificationMenu}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
            {showSupportMessage ? (
                <View style={styles.topNotification}>
                    <Image
                        source={require('../assets/customer-service.png')}
                        style={styles.topNotificationIcon}
                        resizeMode="contain"
                    />
                    <View style={styles.topNotificationText}>
                        <Text style={styles.topNotificationTitle}>Support Message</Text>
                        <Text style={styles.topNotificationSubtitle}>
                            Your message has been sent to support.
                        </Text>
                    </View>
                </View>
            ) : topNotification ? (
                <View style={styles.topNotification}>
                    <Image
                        source={require('../assets/driving-rafiki.png')}
                        style={styles.topNotificationIcon}
                        resizeMode="contain"
                    />
                    <View style={styles.topNotificationText}>
                        <Text style={styles.topNotificationTitle}>Driving Test Dates</Text>
                        <Text style={styles.topNotificationSubtitle}>
                            {topNotification.text}
                        </Text>
                        <Text style={styles.topNotificationLink}>Click here and check it now</Text>
                    </View>
                </View>
            ) : null}
            <View style={styles.options}>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigateTo('ManualBooking')}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Manual booking</Text>
                        <Text style={styles.optionSubtitle}>Check free dates</Text>
                    </View>
                    <BookingIcon width={30} height={30} />

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigateTo('TestCentresChoose')}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Test centres</Text>
                        <Text style={styles.optionSubtitle}>Your test centres</Text>
                    </View>
                    <Image
                        source={require('../assets/land-layer-location.png')}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigateTo('TestDatesChoose')}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Test dates</Text>
                        <Text style={styles.optionSubtitle}>
                            Your availability for autobook
                        </Text>
                    </View>
                    <Image
                        source={require('../assets/calendar-clock.png')}
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.notifications}>

                <Text style={styles.notificationsTitle}>Notifications</Text>
                <FlatList

                    data={bottomNotifications}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    renderItem={renderNotification}
                />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0347ff',
    },
    topNotification: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginBottom: 20,
    },
    topNotificationMenu: {
        width: 40,
        height: 30,
    },
    topNotificationIcon: {
        width: 80,
        height: 50,
    },
    topNotificationText: {
        marginLeft: 10,
    },
    topNotificationTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    topNotificationSubtitle: {
        color: '#7d7d7d',
    },
    topNotificationLink: {
        color: '#0347ff',
        textDecorationLine: 'underline',
    },
    options: {
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        marginBottom: 15,

    },
    optionContent: {
        flexDirection: 'column',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0347ff',
        marginBottom: 5,
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#0347ff',
    },
    notifications: {
        flex: 1,
        marginTop: 20,
    },
    notificationsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
    },
    notificationIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    notificationText: {
        flex: 1,
    },
    notificationTitle: {
        fontWeight: '900',
        color: 'black',
        fontSize: 16,
        marginBottom: 5,
    },
    notificationDate: {
        fontSize: 14,
        color: '#0347ff',
    },
});

export default HomeModule;
