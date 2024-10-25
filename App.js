import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import OnboardingComponent from './screens/OnboardingComponent';
import LoginComponent from './screens/LoginComponent';
import TestSelection from './screens/TestSelection';
import LicenseDetails from './screens/LicenseDetails';
import OfferSelection from './screens/OfferSelection';
import PremiumSuccess from './screens/PremiumSuccess';
import TestCentres from './screens/TestCentres';
import TestDates from './screens/TestDates';
import EmailNotification from './screens/EmailNotification';
import HomeModule from './screens/HomeModule';
import Settings from './screens/Settings';
import Support from './screens/Support';
import TestCentresChoose from './screens/TestCentresChoose';
import TestDatesChoose from './screens/TestDatesChoose';
import PremiumSite from './screens/PremiumSite';
import ManualBooking from './screens/ManualBooking';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingComponent}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginComponent}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TestSelection"
                    component={TestSelection}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="LicenseDetails"
                    component={LicenseDetails}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="OfferSelection"
                    component={OfferSelection}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="PremiumSuccess"
                    component={PremiumSuccess}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TestCentres"
                    component={TestCentres}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TestDates"
                    component={TestDates}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="EmailNotification"
                    component={EmailNotification}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="HomeModule"
                    component={HomeModule}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Support"
                    component={Support}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TestCentresChoose"
                    component={TestCentresChoose}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TestDatesChoose"
                    component={TestDatesChoose}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="PremiumSite"
                    component={PremiumSite}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ManualBooking"
                    component={ManualBooking}
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
