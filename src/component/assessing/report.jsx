import React from 'react';
import Form from 'react-bootstrap/Form'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { withFirebase } from '../firebase/context'
import manageScore from '../firebase/manageScore'

class ReportBase extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      subject: "",
      subjects: [],
      columnDefs : this.getColumn(),
      rowData: []
    }
    this.getRows()
    this.getSubjects()
  }
 // check parent function
  getRows(){
    var rows = [];
    // get all subjects
    this.props.firebase.db.collection('subjects').where("name", "==","Machine 1").get().then(subjects=>{

      // iterate the arrays synchronously
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
            //Get the Date
            let dateValue= categoryRef['date']
            promises1.push(categoryRef['category'].get().then(referenceCategory =>{
              let categoryCategoryRef = referenceCategory.data()
              //Get the Category
              let categoryName = categoryCategoryRef['name'];
              promises2.push(this.props.firebase.db.collection('categories').get().then(categoryDocs =>{
                for (let x in categoryDocs.docs){
                  promises3.push(categoryDocs.docs[x].ref.collection("features").get().then(featureDocs =>{
                    for(let y in featureDocs.docs){
                      let featureDocument = featureDocs.docs[y].data()
                      //Get the Feature
                      let featureValue = featureDocument['name'] 
                      promises4.push(assessments.docs[j].ref.collection('scores').get().then(scoreCollection => {
                        for(let z in scoreCollection.docs){
                          let scoreDoc = scoreCollection.docs[z].data()
                          //Get the Score
                          let scoreValue = scoreDoc['score']
                          promises5.push(scoreDoc['type'].get().then(scoreType =>{
                            let scoreTypeData = scoreType.data()
                            //Get the Criteria
                            let criteriaValue = scoreTypeData['name']
                            //Create the row
                            var row = {
                              category: categoryName.toString(), 
                              feature: featureValue.toString(), 
                              criteria: criteriaValue.toString(),
                              date: dateValue.toDate().toISOString().slice(0,10),
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

//where("capital", "==", true).get().then

  getname(){
    let name = []
    let promises = []
    promises.push(this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        name.push(doc.get('name'))
      })
    }))
    Promise.all(promises).then(_=>{
      console.log(name)
      return name

    })
  }

  getSubjects(){
    let names = []
    let promises = []
    promises.push(this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        let subject = {name: doc.get('name').toString(), snapshot: doc}
        names.push(subject)
      })
    }))
    return Promise.all(promises).then(_=>{
      let subjectMap = names.map((subject, i) => {
        return <option key ={i} name = {subject['name']} value = {subject}> {subject['name']}</option>
      })
      this.setState({subjects: subjectMap})
    })
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

  handleChange (snapshot){
    console.log(snapshot['snapshot'])
    manageScore.getRows(this.props.firebase.db, snapshot['snapshot']).then(rows =>{
      console.log(rows)
      this.setState({rowData: rows})
    })
    
  }
  render() {
    return (
      <div className="ag-theme-balham"
        style = {{flex:1, height:'80vh', width: '80%', margin: '2rem auto'}}
      >

      <Form.Group>
        <Form.Control as="select"
          id = "subject"
          placeholder = "Select a Subject"
          title = "Subject"
          onChange={() => console.log((document.getElementById('subject').value))}
          children = {this.state.subjects}
          >
        </Form.Control>
      </Form.Group>

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
