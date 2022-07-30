import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyA3LfeN_PNjLzEq4kBBllD-oguhNHO9t6k",
  authDomain: "chat-champ.firebaseapp.com",
  projectId: "chat-champ",
  storageBucket: "chat-champ.appspot.com",
  messagingSenderId: "545594227036",
  appId: "1:545594227036:web:e6e22f019e2db352456999",
};

const app =
  firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();

export const storage = app.storage();
