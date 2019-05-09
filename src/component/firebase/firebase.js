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

  resolveUser = () => {
    return new Promise((resolve, reject) => {
      let user = this.auth.user;
      if (this.auth.currentUser!==null) {
        // Fetch user permissions before page loads
        resolve(this.db.collection('users').doc(this.auth.currentUser.uid)
          .get().then((user) => {
            return Promise.all([user.data().role.get().then((role) => {
              let permissions = role.data().permissions;
              let promises = [];
              for (let i = 0; i < permissions.length; i++) {
                promises.push(new Promise(resolve => {
                  resolve(permissions[i].get().then((permission => {
                    return Promise.all([this.userPermissions.push(permission.data())]);
                  })));
                }));
              }
              return Promise.all(promises);
            })]);
          }).then(() => user)
        );
      } else {
        resolve(user);
      }
    });
  }
}



export default Firebase;

//Inspired by: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
