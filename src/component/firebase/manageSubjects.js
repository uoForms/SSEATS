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
  data.creation_date = new Date(data.creation_date);
  return userDocumentReference.set(data);
}
