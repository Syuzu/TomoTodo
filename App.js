import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DefaultTheme, Provider} from 'react-native-paper';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UserScreen from './screens/UserScreen';
import CalendarScreen from './screens/CalendarScreen';
import HomeScreen from './screens/HomeScreen';
import { auth } from './components/firebase';
import { LogBox } from 'react-native';
import * as screen from './components/ScreenSize';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: 'transparent', // Use transparent to disable the little highlighting oval
  },
};

const App = () => {
  LogBox.ignoreAllLogs();
  const [login, setLogin] = useState(false);

  delay = ms => new Promise(
      resolve => setTimeout(resolve, ms)
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
        if(user){
            await delay(5000);
            setLogin(true)
        } else {
          setLogin(false)
        }
    })
    return unsubscribe
  }, [])

  if (login == false) {
    return (
      <NavigationContainer>
        <StatusBar hidden={true}/>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Intro" component={IntroScreen} />
          <Stack.Screen options={{headerTransparent: true, headerTitle: ''}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerTransparent: true, headerTitle: ''}} name="Signup" component={SignupScreen} />     
        </Stack.Navigator>
      </NavigationContainer>
    );
  }  

  if (login == true) {
    return (
      <NavigationContainer>
        <StatusBar hidden={true}/>
        <Tab.Navigator 
        activeColor="#f0edf6" 
        inactiveColor="#3e2465" 
        initialRouteName="Home" 
        labeled={false}
        detachInactiveScreens={true}
        barStyle={{ 
            backgroundColor: 'lightblue',
            position: 'absolute',
            bottom: 0,
            overflow: 'hidden',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 0,
            height: screen.vh*0.1,
            }}>
            <Tab.Screen 
            name="Calendar" 
            component={CalendarScreen}
            options={{
              tabBarLabel: 'Calendar',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="calendar-text" color={color} size={30} padding={0}/>
              ),
            }}
            />
            <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={30} />
              ),
            }}
            />
            <Tab.Screen 
            name="User" 
            component={UserScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account-outline" color={color} size={30} />
              ),
            }}
            />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }  
}

export default function Main() {
  return (
    <Provider theme={theme}>
      <App />
    </Provider>
  );
}