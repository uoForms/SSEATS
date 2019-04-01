import React from 'react';
import Button from 'react-bootstrap/Button';
import Sidebar from "react-sidebar";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { withFirebase } from '../firebase/context';
import AddScore from './addScore.jsx';
import manageScore from '../firebase/manageScore';

class ReportBase extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      columnDefs : this.getColumn(),
      rowData: [],
      sidebarOpen: false
    }
    this.getRows()
  }
 // check parent function
  getRows(){
    // get all subjects
    this.props.firebase.db.collection('subjects').get().then(subjects=>{
      return manageScore.getRows(this.props.firebase.db, subjects);
    }).then(rows=>{
      this.setState({rowData:rows});
    });
}

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

  onSetSidebarOpen(open, context) {
    context.setState({sidebarOpen:open});
  }

  render() {
    return (
      <div className="ag-theme-balham"
        style = {{flex:1, height:'80vh', width: '80%', margin: '2rem auto'}}
      >
        {
          this.state.sidebarOpen?
          <Sidebar
            sidebar={<AddScore subjectDocumentReference={null}/>}
            open="true"
            onSetOpen={event=>this.onSetSidebarOpen(event, this)}
            styles={{ sidebar: { background: "white" } }}
            pullRight="true"
          />
          :null
        }
        <Button onClick={event=>this.setState({sidebarOpen:true})}>Add Score</Button>
        <AgGridReact 
          style={{maxWidth:"100%"}}
          columnDefs = {this.state.columnDefs}
          rowData = {this.state.rowData}
        />
      </div>
    );
  }
}

const Report = withFirebase(ReportBase);
export default Report;
