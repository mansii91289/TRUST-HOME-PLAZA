// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "trust-home-plaza.firebaseapp.com",
//   projectId: "trust-home-plaza",
//   storageBucket: "trust-home-plaza.appspot.com",
//   messagingSenderId: "996843045983",
//   appId: "1:996843045983:web:40031f77e117c5e8b907ea"
// };
// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "trusthomeplaza.firebaseapp.com",
  projectId: "trusthomeplaza",
  storageBucket: "trusthomeplaza.firebasestorage.app",
  messagingSenderId: "720014647538",
  appId: "1:720014647538:web:f292cedee9e941ea77306b",
  measurementId: "G-R81QZWXTVB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);