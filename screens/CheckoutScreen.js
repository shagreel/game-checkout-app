import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarcodeScanner from '../components/BarcodeScanner';

export default function CheckoutScreen({ user }) {
  const [scannedCode, setScannedCode] = useState(null);
  const [itemStatus, setItemStatus] = useState(null); // 'available' or 'borrowed'
  const [borrowedBy, setBorrowedBy] = useState(null);

  const handleBarcodeScanned = async (barcode) => {
    setScannedCode(barcode);

    const itemData = await AsyncStorage.getItem(`item:${barcode}`);
    if (itemData) {
      const item = JSON.parse(itemData);
      setItemStatus(item.status);
      setBorrowedBy(item.user);
    } else {
      setItemStatus('available');
      setBorrowedBy(null);
    }
  };

  const handleAction = async () => {
    if (!scannedCode) return;

    if (itemStatus === 'available') {
      const newItem = { status: 'borrowed', user };
      await AsyncStorage.setItem(`item:${scannedCode}`, JSON.stringify(newItem));
      setItemStatus('borrowed');
      setBorrowedBy(user);
      Alert.alert('Success', 'Item borrowed!');
    } else if (itemStatus === 'borrowed') {
      const newItem = { status: 'available', user: null };
      await AsyncStorage.setItem(`item:${scannedCode}`, JSON.stringify(newItem));
      setItemStatus('available');
      setBorrowedBy(null);
      Alert.alert('Success', 'Item returned!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout System</Text>
      <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />

      {scannedCode && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Barcode:</Text>
          <Text style={styles.value}>{scannedCode}</Text>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{
            itemStatus === 'available'
              ? 'Available'
              : `Borrowed by ${borrowedBy?.name || 'unknown'} (${borrowedBy?.email || ''})`
          }</Text>
          <Button
            title={itemStatus === 'available' ? 'Borrow' : 'Return'}
            onPress={handleAction}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  infoBox: { marginTop: 24, padding: 16, borderRadius: 8, backgroundColor: '#f3f3f3' },
  label: { fontSize: 16, color: '#555', marginTop: 8 },
  value: { fontSize: 18, marginBottom: 8 }
});
