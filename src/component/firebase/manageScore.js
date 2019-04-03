let score = {
  // create assessment, then create score
  createScore: (subjectDocumentReference, data)=>{
    let assessmentDocumentReference = subjectDocumentReference.collection('assessments').doc()
    return assessmentDocumentReference.set({
      category:data.type.split('/features/')[0],
      date:new Date(),
      entry_type:'single'
    }).then(_=>assessmentDocumentReference.collection('scores').doc().set(data));
  },
  
  // Returns a promise containing an object contaning a category, feature, criteria hiearchy.
  getCriterias: db=>{
    let criteriaMap = {};
    return db.collection('categories').get().then(categories=>{
      let promises = [];
      for (let i in categories.docs) {
        let category = categories.docs[i].get('name');
        criteriaMap[category] = {};
        promises.push(categories.docs[i].ref.collection('features').get().then(features=>{
          let promises1 = [];
          for (let j in features.docs) {
            let feature = features.docs[j].get('name');
            criteriaMap[category][feature] = [];
            promises1.push(features.docs[j].ref.collection('criteria').get().then(criterias=>{
              let promises2 = [];
              for (let k in criterias.docs) {
                promises2.push(new Promise(resolve=>{
                  criteriaMap[category][feature].push({[criterias.docs[k].get('name')] : criterias.docs[k].ref.path});
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
  },

  getScore: (categoryDocumentReference)=>{
    let scoreRefs = [];
    return categoryDocumentReference.get().then(category=>{
      return category.get('report_type').get();
    }).then(report_type=>{
      let promises = [];
      let scores = report_type.get('scores');
      for (let i in scores) {
        promises.push(scores[i].get().then(score=>{
          scoreRefs.push(score.data())
        }))
      }
      return Promise.all(promises);
    }).then(_=>scoreRefs);
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
          let dateValue= assessments.docs[j].get('date');
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
