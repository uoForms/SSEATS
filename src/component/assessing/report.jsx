import React from 'react';
import Form from 'react-bootstrap/Form';
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
      subjectDocRef : "",
      subjects: [],
      snapshotMap : {},
      columnDefs : this.getColumn(),
      rowData: [],
      sidebarOpen: false
    }
  }

 componentWillMount(){
  this.getSubjects()
 }

  getname(){
    let name = []
    let promises = []
    promises.push(this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        name.push(doc.get('name'))
      })
    }))
    Promise.all(promises).then(_=>{
      return name

    })
  }

  getSubjects(){
    let names = []
    let promises = []
    let docSnapMap = {}
    names.push({name: "Select a Subject", docRef: "clear", docSnapMap: "clear"})
    promises.push(this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        let subject = {name: doc.get('name'), docRef: doc.ref.path, docSnapshot: result}
        docSnapMap[doc.ref.path] = doc
        names.push(subject)
      })
    }))
    return Promise.all(promises).then(_=>{
      let subjectMap = names.map((subject, i) => {
        return <option key ={i} name = {subject['name']} value = {subject['docRef']}> {subject['name']}</option>
      });
      this.setState({subjects: subjectMap, snapshotMap: docSnapMap});
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

  onSetSidebarOpen(open, context) {
    context.setState({sidebarOpen:open});
  }

  handleChange (documentReference){
    if(documentReference ==="clear") {
      this.setState({rowData:[], subjectDocRef:""});
    }else{
      this.setState({subjectDocRef:documentReference});
      return manageScore.getRows(this.props.firebase.db, this.state.snapshotMap[documentReference]).then(rows =>{
        this.setState({rowData: rows});
      });
    }
  }

  render() {
    return (
      <div className="ag-theme-balham"
        style = {{flex:1, height:'80vh', width: '80%', margin: '2rem auto'}}
      >
      <Form.Group>
        <Form.Label>Select a Subject</Form.Label>
        <Form.Control as="select"
          id = "subject"
          placeholder = "Select a Subject"
          title = "Subject"
          onChange={_ => {
            this.handleChange(document.getElementById('subject').value)
          }}
          children = {this.state.subjects}
          >
        </Form.Control>
      </Form.Group>
      <Form.Group>
        {
          this.state.sidebarOpen?
          <Sidebar
            sidebar={<AddScore subjectDocumentReference={this.props.firebase.db.doc(this.state.subjectDocRef)} exit={_=>this.setState({sidebarOpen:false})}/>}
            open={true}
            children={<div/>}
            onSetOpen={event=>this.onSetSidebarOpen(event, this)}
            styles={{ sidebar: { background: "white" } }}
            pullRight={true}
          />
          :null
        }
        {
          this.state.subjectDocRef==="" ?
          <Button variant="secondary" disabled>Add Score</Button> :
          <Button onClick={_=>this.setState({sidebarOpen:true})}>Add Score</Button>
        }
      </Form.Group>
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
