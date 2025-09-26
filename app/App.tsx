import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import CityListScreen from './screens/CityListScreen';
import CityDetailsScreen from './screens/CityDetailsScreen';
import { Ionicons } from '@expo/vector-icons';

export type RootStackParamList = {
  CityList: undefined;
  CityDetails: { city: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function WeatherStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4a90e2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="CityList"
        component={CityListScreen}
        options={{ title: '🌦️ weatherapp' }}
      />
      <Stack.Screen
        name="CityDetails"
        component={CityDetailsScreen}
        options={({ route }) => ({
          title: route.params.city.split(',')[0],
        })}
      />
    </Stack.Navigator>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>⚙️ settings (coming soon)</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#4a90e2',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Weather') {
              return <Ionicons name="cloud-outline" size={size} color={color} />;
            } else if (route.name === 'Settings') {
              return <Ionicons name="settings-outline" size={size} color={color} />;
            }
            return null;
          },
        })}
      >
        <Tab.Screen name="Weather" component={WeatherStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
