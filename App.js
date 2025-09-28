import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserSetupScreen from './screens/UserSetupScreen';
import CheckoutScreen from './screens/CheckoutScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(data => {
      if (data) setUser(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator />;
  return user
    ? <CheckoutScreen user={user} />
    : <UserSetupScreen onSetup={setUser} />;
}