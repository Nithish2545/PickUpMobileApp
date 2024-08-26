import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function DetailScreen({ route }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>AWB No:</Text>
      <Text style={styles.value}>{user.AWB_NUMBER}</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{user.NAME}</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{user.ADDRESS}</Text>
      <Text style={styles.label}>Weight Apx:</Text>
      <Text style={styles.value}>{user.WEIGHTAPX}</Text>
      <Text style={styles.label}>Preferred Date&Time:</Text>
      <Text style={styles.value}>{user.PREFERRED_DATE_TIME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
});

export default DetailScreen;