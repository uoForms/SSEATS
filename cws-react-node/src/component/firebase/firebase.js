import app from 'firebase/app';
import 'firebase/auth';

var config = {
    apiKey: "AIzaSyDtZEaJq2J1qCRubI9dUtuWYQcU-DmUxks",
    authDomain: "pomme-cws.firebaseapp.com",
    databaseURL: "https://pomme-cws.firebaseio.com",
    projectId: "pomme-cws",
    storageBucket: "pomme-cws.appspot.com",
    messagingSenderId: "750521849961"
};

class Firebase {
  constructor(){
    app.initializeApp(config);
    this.auth = app.auth();
  }

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

}

export default Firebase;

//Inspired by: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
