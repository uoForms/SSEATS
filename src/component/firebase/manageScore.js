let score = {
  createScore: (assessmentDocumentReference, data)=>{
    return assessmentDocumentReference.collection('scores').doc().set(data)
  },
  // Returns a promise that has rows as a value.
  getRows: (firestore, subjectsQuerySnapshot)=>{
    // Key is criteria ref, value is array of corresponding rows.
    let scoresMap = {};
    
    // Step 1, get all scores and Initialize the scoresMap. O(n), n is number of scores
    let promises = [];
    for(let i in subjectsQuerySnapshot.docs){
      promises.push(subjectsQuerySnapshot.docs[i].ref.collection('assessments').get().then(assessments=>{
        let promises1 = [];
        for(let j in assessments.docs){
          //Get the Date
          let dateValue= assessments.docs[j].data().date;
          promises1.push(assessments.docs[j].ref.collection('scores').get().then(scores => {
            let promises2 = [];
            for(let k in scores.docs){
              promises2.push(new Promise(resolve=>{
                let score = scores.docs[k].data();
                // Create key if not there.
                if (scoresMap[score.type.path] === undefined){
                  scoresMap[score.type.path] = [];
                }
                // Start putting the score data for row.
                scoresMap[score.type.path].push({
                  date: dateValue.toDate().toISOString().slice(0,10),
                  comment: score.comment,
                  score: score.score
                });
                resolve();
              }));
            }
            return Promise.all(promises2);
          }));
        }
        return Promise.all(promises1);
      }));
    }
    return Promise.all(promises)
    // Step 2 get all data from the criteria and it's parents and update the scoresMap. O(n)
    .then(_=>{
      let promises = [];
      for (let criteriaPath in scoresMap) {
        // Only iterate over object values and not the other stuff inside objects.
        if (scoresMap.hasOwnProperty(criteriaPath)) {
          let criteriaDocumentReference = firestore.doc(criteriaPath);
          let featureDocumentReference = criteriaDocumentReference.parent.parent;
          let categoryDocumentReference = featureDocumentReference.parent.parent;
          promises.push(categoryDocumentReference.get().then(category=>{
            return featureDocumentReference.get().then(feature=>{
              return criteriaDocumentReference.get().then(criteria=>{
                // finish putting the criteria data for the row.
                for (let i in scoresMap[criteriaPath]){
                  scoresMap[criteriaPath][i]['category'] = category.get('name');
                  scoresMap[criteriaPath][i]['feature'] = feature.get('name');
                  scoresMap[criteriaPath][i]['criteria'] = criteria.get('name');
                }
              });
            });
          }));
        }
      }
      return Promise.all(promises);
    })
    .then(_=>{
      let rows = [];
      for (let key in scoresMap) {
        // Only iterate over object values and not the other stuff inside objects.
        if (scoresMap.hasOwnProperty(key)) {
          rows = rows.concat(scoresMap[key]);
        }
      }
      return rows;
    });
  }
};
export default score;
