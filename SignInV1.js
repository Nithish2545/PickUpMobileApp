import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignIn = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const handleSendOTP = async () => {
    if (phoneNumber.length === 0) {
      Alert.alert('Error', 'Please enter a phone number.');
      return;
    }
    try {
      // Ensure the phone number is in the correct format
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'A verification code has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
  };

  const handleConfirmOTP = async () => {
    if (verificationCode.length === 0) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }
    try {
      await confirm.confirm(verificationCode);
      Alert.alert('Success', 'Phone number verified!');
      navigation.navigate('HomePage'); // Navigate to home page
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.form}>
        {confirm ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              keyboardType="number-pad"
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.button} onPress={handleConfirmOTP}>
              <Text style={styles.buttonText}>Confirm OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
        </Text>
        <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Forgot Password pressed')}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1F2937',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 48,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6D28D9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#6D28D9',
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    marginTop: 8,
    fontSize: 14,
    color: '#6D28D9',
    textDecorationLine: 'underline',
  },
});

export default SignIn;