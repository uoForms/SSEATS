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
    this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        var documentData = doc.data()
        console.log(documentData['name'])
        doc.ref.collection('assessments').get().then(assessment=>{
          assessment.docs.forEach(coll=>{
            var categoryRef = coll.data()
            categoryRef['category'].get().then(referenceCategory =>{
              var categoryName = referenceCategory.data()
              categoryName = categoryName['name']
              console.log(categoryName)
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
        headerName: "Feature", 
        field : "feature"     
      },
      {
        headerName: "Criteria", 
        field : "criteria"        
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
