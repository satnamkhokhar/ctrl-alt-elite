import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import NamesScreen from './src/screens/NamesScreen';
import EmailPassword from './src/screens/EmailPassword';
import HomeScreen from './src/screens/HomeScreen';
import DietaryRestrictionsScreen from './src/screens/DietaryRestrictionsScreen';

//allows the app to switch screens
const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='loginScreen'>
            <Stack.Screen name='loginScreen' component={LoginScreen} />
            <Stack.Screen name='NamesScreen' component={NamesScreen} />
            <Stack.Screen name='EmailPassword' component={EmailPassword}/>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='DietaryRestrictionsScreen' component={DietaryRestrictionsScreen} />
        </Stack.Navigator>
    </NavigationContainer>   
    );
}
