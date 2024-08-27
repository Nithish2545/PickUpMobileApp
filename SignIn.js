// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const SignIn = () => {
//   const [selectedRole, setSelectedRole] = useState('pickup');

//   const handleSignIn = () => {
//     // Handle sign in logic here
//     Alert.alert("Sign In", `Sign In button pressed with role: ${selectedRole}`);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image source={require('./assets/logo.png')} style={styles.logo} />
//       </View>
//       <Text style={styles.title}>Sign In</Text>
//       <View style={styles.form}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your phone number"
//           keyboardType="phone-pad"
//           autoCapitalize="none"
//           placeholderTextColor="#9CA3AF"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your password"
//           secureTextEntry
//           placeholderTextColor="#9CA3AF"
//         />
        
//         <TouchableOpacity style={styles.button} onPress={handleSignIn}>
//           <Text style={styles.buttonText}>Sign In</Text>
//         </TouchableOpacity>
       
//       </View>
//       <View style={styles.footer}>
//         <Text style={styles.signUpText}>
//           Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
//         </Text>
//         <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Forgot Password pressed")}>
//           <Text style={styles.forgotPassword}>Forgot your password?</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     padding: 16,
//   },
//   logoContainer: {
//     marginBottom: 24,
//   },
//   logo: {
//     width: 120,
//     height: 60,
//     resizeMode: 'contain',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#1F2937',
//   },
//   form: {
//     width: '100%',
//     maxWidth: 400,
//   },
//   input: {
//     height: 48,
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     backgroundColor: '#FFFFFF',
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#6D28D9',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     elevation: 3,
//     marginBottom: 16, // Space before the picker
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   footer: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   signUpText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   signUpLink: {
//     color: '#6D28D9',
//     textDecorationLine: 'underline',
//   },
//   forgotPassword: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#6D28D9',
//     textDecorationLine: 'underline',
//   },
//   picker: {
//     height: 48,
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//   },
// });

// export default SignIn;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignIn = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const handleSendOTP = async () => {
    console.log(phoneNumber)  
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      console.log(confirmation)
      Alert.alert('OTP Sent', 'A verification code has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfirmOTP = async () => {
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
      <View style={styles.logoContainer}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
      </View>
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
        <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Forgot Password pressed")}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Same styles as before, just make sure to keep the styles consistent
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
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