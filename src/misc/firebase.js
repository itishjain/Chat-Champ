import firebase from "firebase/app";

const config = {
  apiKey: "AIzaSyA3LfeN_PNjLzEq4kBBllD-oguhNHO9t6k",
  authDomain: "chat-champ.firebaseapp.com",
  projectId: "chat-champ",
  storageBucket: "chat-champ.appspot.com",
  messagingSenderId: "545594227036",
  appId: "1:545594227036:web:e6e22f019e2db352456999",
};

const app = firebase.initializeApp(config);

console.log(app);
