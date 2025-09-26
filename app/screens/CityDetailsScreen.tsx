import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator, FlatList,  StyleSheet,Image,} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const API_KEY = '936c83de32d0fc44640fea0253cc0ea2';

type Props = {
  route: RouteProp<RootStackParamList, 'CityDetails'>;
};

type WeatherData = {
  temp: number;
  wind: number;
  humidity: number;
  hourly: { dt: number; temp: number; weather: { icon: string }[] }[];
};

export default function CityDetailsScreen({ route }: Props) {
  const { city } = route.params;
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=936c83de32d0fc44640fea0253cc0ea2&units=metric`
      );
      const currentData = await currentRes.json();
      const { coord } = currentData;

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,alerts&appid=936c83de32d0fc44640fea0253cc0ea2&units=metric`
      );
      const forecastData = await forecastRes.json();

      setWeather({
        temp: currentData.main.temp,
        wind: currentData.wind.speed,
        humidity: currentData.main.humidity,
        hourly: forecastData.hourly.slice(0, 24),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderForecastItem = (item: any) => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();
    return (
      <View style={styles.forecastItem}>
        <Text style={styles.forecastHour}>{hour}:00</Text>
        <Image
          style={styles.icon}
          source={{
            uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          }}
        />
        <Text style={styles.forecastTemp}>{Math.round(item.temp)}°C</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.center}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.detailsText}>🌡️ Temp: {weather.temp}°C</Text>
      <Text style={styles.detailsText}>💨 Wind: {weather.wind} m/s</Text>
      <Text style={styles.detailsText}>💧 Humidity: {weather.humidity}%</Text>

      <Text style={styles.forecastTitle}>Forecast (Next 24h)</Text>
      <FlatList
        data={weather.hourly}
        horizontal
        keyExtractor={(item) => item.dt.toString()}
        renderItem={({ item }) => renderForecastItem(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  detailsText: { fontSize: 16, marginBottom: 8 },
  forecastTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  forecastItem: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  forecastHour: { fontSize: 14, fontWeight: '500' },
  forecastTemp: { fontSize: 16, marginTop: 5 },
  icon: { width: 50, height: 50 },
});
