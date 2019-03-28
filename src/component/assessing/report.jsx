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
      rowData:[
        {name: "Test",score :"9", comment:"Testing Table"},
        {name: "Test1",score :"1", comment:"Testing Table"},
        {name: "Test2",score :"2", comment:"Testing Table"},
        {name: "Test3",score :"3", comment:"Testing Table"},
        {name: "Test4",score :"4", comment:"Testing Table"},
        {name: "Test5",score :"5", comment:"Testing Table"},
        {name: "Test6",score :"6", comment:"Testing Table"}

      ]
    }
    this.getRows()
  }

  getRows(){
    var rows = []
    var feature
    this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        var documentData = doc.data()
        var name = documentData['name']
        doc.ref.collection('assessments').get().then(assessment=>{
          assessment.docs.forEach(coll=>{
            var categoryRef = coll.data()
            categoryRef['category'].get().then(referenceCategory =>{
              var categoryCategoryRef = referenceCategory.data()
              var categoryName = categoryCategoryRef['name']

              //Getting the Category Name
              this.props.firebase.db.collection('categories').get().then(category=>{
                category.docs.forEach(catDoc=>{
                  catDoc.ref.collection("features").get().then(featureDoc=>{
                    featureDoc.docs.forEach(featureCollection =>{
                      var featureDocument = featureCollection.data()
                      feature = featureDocument['name']


                      //Getting the score
                      coll.ref.collection('scores').get().then(scoreCollection => {
                        scoreCollection.docs.forEach(scoreRef=>{
                          var scoreDoc = scoreRef.data()
                          var score = scoreDoc['score']
                          scoreDoc['type'].get().then(scoreType =>{
                            var scoreTypeData = scoreType.data()
                            var criteria = scoreTypeData['name']
                            console.log(name)
                            console.log(categoryName)
                            console.log(feature)
                            console.log(criteria)
                            console.log(score)
                            rows.push({name: name, category:categoryName, feature: feature})
                          })
                        })
                      })

                    })
                  })
                })
              })  
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


            })
          })
        })
    });
  })
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
        headerName: "Subject", 
        field : "name"
      },
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
        style = {{ height: '90%', width: '70%', margin: '5rem auto'}}
      >
        <AgGridReact 
          columnDefs = {this.state.columnDefs}
          rowData = { this.state.rowData}>
        </AgGridReact>
      </div>
    );
  }
}

const Report = withFirebase(ReportBase);
export default Report;
