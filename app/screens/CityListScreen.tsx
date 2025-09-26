import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const API_KEY = '936c83de32d0fc44640fea0253cc0ea2';

const CITIES = [
  { name: 'Cape Town', q: 'Cape Town,ZA' },

  { name: 'Johannesburg', q: 'Johannesburg,ZA' },
  { name: 'Durban', q: 'Durban,ZA' },
  { name: 'Pretoria', q: 'Pretoria,ZA' },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CityList'>;
};

export default function CityListScreen({ navigation }: Props) {
  const [cityTemps, setCityTemps] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    CITIES.forEach((city) => {
      fetchWeather(city.q);
    });
  }, []);

 

  const fetchWeather = async (city: string) => {
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await weather.json();
    setCityTemps((prev) => ({ ...prev, [city]: data.main.temp }));
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={CITIES}
        keyExtractor={(item) => item.q}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityButton}
            onPress={() => navigation.navigate('CityDetails', { city: item.q })}
          >
            <Text style={styles.cityName}>
              {item.name}{' '}
              {cityTemps[item.q] ? `- ${Math.round(cityTemps[item.q])}°C` : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7fa' },
  cityButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  cityName: { color: '#fff', fontSize: 18, textAlign: 'center' },
  });