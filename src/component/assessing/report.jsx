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
      gridOptions : null,
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
        field : "category",
        resizable : true
      },
      {
        headerName: "Feature", 
        field : "feature"     ,
        resizable : true
      },
      {
        headerName: "Criteria", 
        field : "criteria",
        resizable : true
      },
      {
        headerName: "Date", 
        field : "date",
        resizable : true
      },
      {
        headerName: "Score",
        field : "score",
        resizable : true
      },
      {
        headerName: "Comment", 
        field : "comment",
        resizable : true
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
        this.setState({rowData: rows},_=>{
          // Callback sets size to whichever is wider between fit and auto.
          this.state.gridOptions.api.sizeColumnsToFit();
          let fit = 0;
          this.state.gridOptions.columnApi.getColumnState().forEach(column=>{
            fit += column.width;
          });
          this.state.gridOptions.columnApi.getAllColumns().forEach(column=>{
              this.state.gridOptions.columnApi.autoSizeColumn(column.colId);
          }, this);
          let auto = 0;
          this.state.gridOptions.columnApi.getColumnState().forEach(column=>{
            auto += column.width;
          });
          if (auto < fit) {
            this.state.gridOptions.api.sizeColumnsToFit();
          }
        });
      });
    }
  }

  render() {
    return (
      <div className="ag-theme-balham"
        style = {{flex:1, height:'80vh', width: '80%', margin: '2rem auto'}}
      >
        <Form.Group>
        <Form.Label>Select a Subject:</Form.Label>
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
              sidebar={<AddScore subjectDocumentReference={this.props.firebase.db.doc(this.state.subjectDocRef)} exit={_=>{
                this.handleChange(this.state.subjectDocRef)
                this.setState({sidebarOpen:false})}}/>}
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
          onGridReady={params=>{
            params.api.sizeColumnsToFit();
            this.setState({gridOptions : params});
          }}
        />
      </div>
    );
  }
}

const Report = withFirebase(ReportBase);
export default Report;
