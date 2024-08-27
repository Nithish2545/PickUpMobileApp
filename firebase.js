// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from '@react-native-firebase/auth'; // Import from @react-native-firebase/auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD01_c55hf0Q4QOVNq-URA-AQLkKArVlr4",
  authDomain: "pickupmobileapp-6f424.firebaseapp.com",
  projectId: "pickupmobileapp-6f424",
  storageBucket: "pickupmobileapp-6f424.appspot.com",
  messagingSenderId: "398169381759",
  appId: "1:398169381759:web:9aaa44c928aff29451984a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Use @react-native-firebase/auth

export { auth };
