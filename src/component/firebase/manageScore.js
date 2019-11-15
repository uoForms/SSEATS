//import _ from "lodash";

let score = {
  // create assessment, then create score
  createScore: (subjectDocumentReference, data)=>{
    let assessmentDocumentReference = subjectDocumentReference.collection('assessments').doc()
    return assessmentDocumentReference.set({
      category:data.type.parent.parent.parent.parent,
      assessor: data.assessor,
      assessorRef: data.assessorRef,
      date:new Date(),
      entry_type:'single'
    }).then(_=>assessmentDocumentReference.collection('scores').doc().set(data));
  },

  // Returns a promise containing an object contaning a category, feature, criteria hiearchy.
  // selectedCategory allows to restrict the return value to one category if need be.
  getCriterias: (db, selectedCategory="")=>{
    let criteriaMap = {};
    return db.collection('categories').get().then(categories=>{
      let promises = [];
      for (var i in categories.docs) {
        let category = categories.docs[i].get('name');
        if (selectedCategory === "" || categories.docs[i].ref.path === selectedCategory)
        {
          criteriaMap[category] = {};
          promises.push(categories.docs[i].ref.collection('features').get().then(features=>{
            let promises1 = [];
            for (var j in features.docs) {
              let feature = features.docs[j].get('name');
              criteriaMap[category][feature] = [];
              promises1.push(features.docs[j].ref.collection('criteria').get().then(criterias=>{
                let promises2 = [];
                criterias.docs.forEach(doc=>{
                  promises2.push(new Promise(resolve=>{
                    criteriaMap[category][feature].push({[doc.get('name')] : doc.ref.path});
                    resolve();
                  }));
                });
                return Promise.all(promises2);
              }));
            }
            return Promise.all(promises1);
          }));
        }
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
      for (var i in scores) {
        promises.push(scores[i].get().then(score=>{
          scoreRefs.push(score.data())
        }))
      }
      return Promise.all(promises);
    }).then(_=>scoreRefs);
  },

  // Returns a promise that has rows as a value.
  getRows: (firestore, subjectsQuerySnapshot, categoryRef, scoreMapping) => {
    // Key is criteria ref, value is array of corresponding rows.
    let scoresMap = {};

    // Step 1, get all scores and Initialize the scoresMap. O(n), n is number of scores
    let promises = [];
    promises.push(subjectsQuerySnapshot.collection('assessments')
      .where('category', '==', categoryRef).get().then(assessments=>{
      let promises1 = [];
      for(var j in assessments.docs){
          let assessmentIndex = j;
          //Get the Date
          let dateValue= assessments.docs[assessmentIndex].get('date');
          promises1.push(assessments.docs[assessmentIndex].ref.collection('scores').get().then(scores => {
            let promises2 = [];
            for(var k in scores.docs){
              let scoreIndex = k;
              promises2.push(new Promise(resolve=>{
                let score = scores.docs[scoreIndex].data();
                // Create key if not there.
                if (scoresMap[score.type.path] === undefined){
                  scoresMap[score.type.path] = [];
                }
                // Start putting the score data for row.
                let row = {
                  date: dateValue.toDate().toISOString().slice(0,10),
                  assessor: assessments.docs[assessmentIndex].get('assessor'),
                  comment: score.comment,
                };
                scoreMapping.forEach((mapping, i) => {
                  row[mapping.name] = score.score[i];
                });
                scoresMap[score.type.path].push(row);
                resolve();
              }));
            }
            return Promise.all(promises2);
          }));
      }
      return Promise.all(promises1);
    }));
    return Promise.all(promises)
    // Step 2 get all data from the criteria and it's parents and update the scoresMap. O(n)
    .then(_=>{
      let promises = [];
      for (var i in scoresMap) {
        let criteriaPath = i;
        // Only iterate over object values and not the other stuff inside objects.
        if (scoresMap.hasOwnProperty(criteriaPath)) {
          let criteriaDocumentReference = firestore.doc(criteriaPath);
          let featureDocumentReference = criteriaDocumentReference.parent.parent;
          let categoryDocumentReference = featureDocumentReference.parent.parent;
          promises.push(categoryDocumentReference.get().then(category=>{
            return featureDocumentReference.get().then(feature=>{
              return criteriaDocumentReference.get().then(criteria=>{
                // finish putting the criteria data for the row.
                for (var i in scoresMap[criteriaPath]){
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
      
      for (var key in scoresMap) {
        // Only iterate over object values and not the other stuff inside objects.
        if (scoresMap.hasOwnProperty(key)) {
          rows = rows.concat(scoresMap[key]);
        }
      }

      //Sort by feature, then criteria then by date.
      rows.sort((a, b) => (a.feature > b.feature) ? 1 : (a.feature === b.feature) ? ((a.criteria > b.criteria) ? 1 : (a.criteria === b.criteria) ? ((a.date < b.date) ? 1 : -1) : -1 ) : -1)

      return rows;
    });
  },  
};



export default score;
