import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import staticData from './staticData.json'; // Import static data

const SignIn = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const user = staticData.users.find(
      (user) => user.phoneNumber === data.phoneNumber && user.password === data.password
    );

    if (user) {
      const roleMessage = user.role === 'admin' ? 'You are signed in as Admin!' : 'You are signed in as Pickup!';
      Alert.alert('Success', roleMessage);
      navigation.navigate('UserDetails'); // Navigate to home page
    } else {
      Alert.alert('Error', 'Invalid phone number or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Phone number must be 10 digits'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.errorInput]}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
        
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            pattern: {
              value: /^[\w!@#$%^&*()_+{}\[\]:;"'<>,.?/\|`~]{6,}$/,
              message: 'Password must be at least 6 characters long'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="Enter your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
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
  errorInput: {
    borderColor: '#FF0000',
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
  errorText: {
    color: '#FF0000',
    marginBottom: 8,
  },
});

export default SignIn;