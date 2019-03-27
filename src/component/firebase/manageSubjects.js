let manageSubjects = {
  createSubject : (db, data)=>{
    return __updateSubject(db.collection('subjects').doc(), data);
  },
  updateSubject : __updateSubject
};
export default manageSubjects;

function __updateSubject(userDocumentReference, data) {
  // Don't modify the actual data object
  data = {...data};
  // set default to false
  if (data.user===undefined){
    data.user = false;
  }
  // Fix the timestamp to match firestore type
  data.date_of_birth = new Date(data.date_of_birth);
  return userDocumentReference.set(data);
}
