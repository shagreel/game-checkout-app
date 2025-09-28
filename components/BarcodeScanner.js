import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useCodeScanner } from 'vision-camera-code-scanner';

export default function BarcodeScanner({ onBarcodeScanned }) {
  const devices = useCameraDevices();
  const device = devices.back;
  const scanned = useRef(false);

  useEffect(() => {
    Camera.requestCameraPermission();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: [
      'ean13', 'ean8', 'upca', 'upce', 'code128'
    ],
    onCodeScanned: (codes) => {
      if (!scanned.current && codes.length > 0) {
        scanned.current = true;
        onBarcodeScanned(codes[0].value);
        setTimeout(() => {
          scanned.current = false;
        }, 1500);
      }
    },
  });

  if (device == null) return <View />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: 'black',
  },
});