import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { withFirebase } from '../firebase/context'

class ReportBase extends React.Component {
  constructor(props){
    super(props);

    this.state = {

      columnDefs : this.getColumn(),
      rowData: []
    }
    this.getRows()
  }
 // check parent function
  getRows(){
    var rows = [];
    // get all subjects
    this.props.firebase.db.collection('subjects').get().then(subjects=>{
      // iterate the array synchronously
      let promises = [];
      let promises1 = [];
      let promises2 = [];
      let promises3 = [];
      let promises4 = [];
      let promises5 = [];

      for(let i in subjects.docs){
        promises.push(subjects.docs[i].ref.collection('assessments').get().then(assessments=>{
          for(let j in assessments.docs){
            let categoryRef = assessments.docs[j].data();
            let dateValue= categoryRef['date']
            promises1.push(categoryRef['category'].get().then(referenceCategory =>{
              let categoryCategoryRef = referenceCategory.data()
              let categoryName = categoryCategoryRef['name'];
              promises2.push(this.props.firebase.db.collection('categories').get().then(categoryDocs =>{
                for (let x in categoryDocs.docs){
                  promises3.push(categoryDocs.docs[x].ref.collection("features").get().then(featureDocs =>{
                    for(let y in featureDocs.docs){
                      let featureDocument = featureDocs.docs[y].data()
                      let featureValue = featureDocument['name'] 
                      console.log(featureValue)
                      promises4.push(assessments.docs[j].ref.collection('scores').get().then(scoreCollection => {
                        for(let z in scoreCollection.docs){
                          let scoreDoc = scoreCollection.docs[z].data()
                          let scoreValue = scoreDoc['score']
                          console.log(scoreDoc)
                          promises5.push(scoreDoc['type'].get().then(scoreType =>{
                            let scoreTypeData = scoreType.data()
                            let criteriaValue = scoreTypeData['name']

                            var row = {
                              category: categoryName.toString(), 
                              feature: featureValue.toString(), 
                              criteria: criteriaValue.toString(),
                              date: dateValue.toDate(),
                              score: scoreValue.toString(),
                              comment: scoreDoc['comment'],
                            }
                            rows.push(row)
                          }))
                        }
                      }))
                    }
                  }))
                }
              }))
            }));
          }
        }));
      }
      return Promise.all(promises).then(_=>{
        return Promise.all(promises1).then(_=>{
          return Promise.all(promises2).then(_=>{
            return Promise.all(promises3).then(_=>{
              return Promise.all(promises4).then(_=>{
                return Promise.all(promises5).then(_=>{
                  this.setState({rowData:rows})
                })
              })
            })
          })
        })
      });
    });
}

              /* Get Score Scale */
              /*
              categoryCategoryRef['report_type'].get().then(reportType =>{
                var reportRef = reportType.data()
                console.log("reportRef", reportRef)
                reportRef['scores'].forEach(scoreScaleDocs=> {
                  scoreScaleDocs.get().then(scoreScale => {
                    console.log(scoreScale.data())
                    var scoreScaleData = scoreScale.data()
                    var scaleMin = scoreScaleData['min']
                    var scaleMax = scoreScaleData['max']
                  })
                })
              })*/



  getname(){
    this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        var documentData = doc.data()
        var name = documentData['name']
        return name
        })
    });
  }

  getSubjects(){
    var names = []
    this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        names.push(doc.get('name'))
      })
    });
  }

  getColumn(){
    return[
      {
        headerName: "Category", 
        field : "category"     
      },
      {
        headerName: "Feature", 
        field : "feature"     
      },
      {
        headerName: "Criteria", 
        field : "criteria"        
      },
      {
        headerName: "Date", 
        field : "date"        
      },
      {
        headerName: "Score",
        field : "score"
      },
      {
        headerName: "Comment", 
        field : "comment"
      }
    ]
  }

  render() {
    return (
      <div className="ag-theme-balham"
        style = {{flex:1, height:'80vh', width: '80%', margin: '2rem auto'}}
      >
        <AgGridReact 
          style={{maxWidth:"100%"}}
          columnDefs = {this.state.columnDefs}
          rowData = {this.state.rowData}>
        </AgGridReact>
      </div>
    );
  }
}

const Report = withFirebase(ReportBase);
export default Report;
