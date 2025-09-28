import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserSetupScreen({ onSetup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const saveUser = async () => {
    if (name && email) {
      const user = { name, email };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      onSetup(user);
    }
  };
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Enter your name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        placeholder="Name"
      />
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Enter your email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        placeholder="Email"
        autoCapitalize="none"
      />
      <Button title="Continue" onPress={saveUser} disabled={!name || !email} />
    </View>
  );
}