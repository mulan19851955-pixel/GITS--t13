import React from 'react';
import { StyleSheet, View } from 'react-native';
import PawLoader from '../components/PawLoader';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <PawLoader size={140} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
