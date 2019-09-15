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

  getUserDoc = async () => {
    return await this.db.collection('users').doc(this.auth.currentUser.uid);
  };

  // Returns a promise containing an object contaning a category, feature, criteria hiearchy.
  getCriterias = () => {
    let criteriaMap = {};
    return this.db.collection('categories').get().then(categories=>{
      let promises = [];
      for (var i in categories.docs) {
        let category = categories.docs[i].get('name');
        criteriaMap[category] = {};
        promises.push(categories.docs[i].ref.collection('features').get().then(features=>{
          let promises1 = [];
          for (var j in features.docs) {
            let feature = features.docs[j].get('name');
            criteriaMap[category][feature] = [];
            promises1.push(features.docs[j].ref.collection('criteria').get().then(criterias=>{
              let promises2 = [];
              for (var k in criterias.docs) {
                let criteria = {[criterias.docs[k].get('name')]: criterias.docs[k].ref.path}
                promises2.push(new Promise((resolve) =>{
                  criteriaMap[category][feature].push(criteria);
                  resolve();
                }));
              }
              return Promise.all(promises2);
            }));
          }
          return Promise.all(promises1);
        }));
      }
      return Promise.all(promises);
    }).then(_=>criteriaMap);
  }

  findByRole = async (role) => {
    const roleRef = this.db.collection("roles").doc(role);
    return roleRef ? await this.db.collection('users').where("role", "==", roleRef).get().then((result) => result.docs) : [];
  };

  getSubjects = async () => {
    return await this.db.collection("subjects").get().then((result) => result.docs);
  };

  getViewableSubjectRefs = async () => {
    const userData = await this.db.collection('users').doc(this.auth.currentUser.uid).get();

    if (!userData.data().subjects){
      return [];
    } else {
      return userData.data().subjects;
    }


  };

  assignSubjects = async (assessor, subjects) => {
    assessor.update({
      subjects: subjects,
    });
  };
}

export default Firebase;

//Inspired by: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
