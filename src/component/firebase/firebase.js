import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

var config = {
  apiKey: "AIzaSyBYhYolH-zgdIn_980Ij1mal54zwHSRpw4",
  authDomain: "sse-ats.firebaseapp.com",
  databaseURL: "https://sse-ats.firebaseio.com",
  projectId: "sse-ats",
  storageBucket: "sse-ats.appspot.com",
  messagingSenderId: "642639128592"
};

class Firebase {
  constructor(){
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.userPermissions = [];
  }

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  passwordResetEmail = (email) =>
    this.auth.sendPasswordResetEmail(email);

  doLogout = () =>  this.auth.signOut().then(_ => this.userPermissions = []);

  }



export default Firebase;

//Inspired by: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
