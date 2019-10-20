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

  addNewUser = (id, email, firstName, lastName) =>
    this.db.collection('users').doc(id).set({
      email:email,
      firstName: firstName,
      lastName: lastName,
      role: this.db.collection("roles").doc("assessor"),
    });

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


  getSubjectAssessments = async (subjectRef) => {
    //Creating a list to put the information
    let subjectAssessmentsList = [];

  
    //Getting a list of all categories
    let categories = await this.listCategories();

    //Getting the Query snapshot
    const subjectRefData =  await this.db.collection('subjects').doc(subjectRef).collection("assessments").get();



    //Parsing the Assessment Documents and adding them into a list. 
    for (var i in subjectRefData.docs) {


    //TODO add an if statement to verify if you are the assessor of this assessment.

    //Getting the information to display the asssessments into a list.
      let categoryRef = subjectRefData.docs[i].get("category").id;

      let time = subjectRefData.docs[i].get("date").seconds;
      let convertDate = new Date(time*1000).toLocaleDateString("en-US")

      let assessment = {"assessmentReference": subjectRefData.docs[i].id, 
                      "date": convertDate, 
                      "categoryName":categories[categoryRef].categoryName, 
                      "entry_type": subjectRefData.docs[i].get("entry_type"),
                      "timestamp": time};

      subjectAssessmentsList.push(assessment);      
    }


    //Sort the array by date
    subjectAssessmentsList.sort(dynamicSort("timestamp"));

    //Return the array
    return subjectAssessmentsList;
  };

  //Create a list where you have the references of all the categories and their names.
  listCategories = async() => {
    let categories = {};
    const categoriesData =  await this.db.collection('categories').get();
    for (var i in categoriesData.docs){
      let categoryRef = categoriesData.docs[i].id;
      let categoryName = categoriesData.docs[i].get("name");
      categories[categoryRef] = {categoryName};
    }
    return categories;
  };

  saveReview = async (review, reviewValue, date, subject) => {
    let reviewDoc;
    if(!review) {
      reviewDoc = subject.collection("reviews").doc();
    } else {
      reviewDoc = review;
    }

    reviewDoc.set({
      review: reviewValue,
      date: date,
    });
    return reviewDoc;
  }

  getReviews = async (subjectRef) => {
    let reviews = {};
    const reviewsData = await subjectRef.collection("reviews").orderBy("date", "desc").get();
    for (var i in reviewsData.docs) {
      let reviewRef = reviewsData.docs[i].id;
      reviews[reviewRef] = reviewsData.docs[i].data();
    }
    return reviews;
  };
  
  getRoleList = () => this.db.collection('roles').get();

}

//Got and inspired from  https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function dynamicSort(property) {
    var index = 1;
    if(property[0] === "-") {
        index = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        return result * index;
    }
}

export default Firebase;

//Inspired by: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
