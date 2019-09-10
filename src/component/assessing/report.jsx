import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
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
      subjectSnapshotMap : {},
      currentCategoryRef:"",
      categories:[],
      categorySnapshotMap: {},
      defaultColDef: this.getDefaultColDef(),
      columnDefs : this.getColumn(),
      gridOptions : null,
      rowData: [],
      sidebarOpen: false
    }
  }

 componentWillMount(){
  this.getSubjects()
  this.getCategories()
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
    names.push({name: "Select a Subject", docRef: ""})
    promises.push(this.props.firebase.db.collection('subjects').get().then(result=>{
      result.docs.forEach(doc=>{
        let subject = {name: doc.get('name'), docRef: doc.ref.path}
        docSnapMap[doc.ref.path] = doc.ref
        names.push(subject)
      })
    }))
    return Promise.all(promises).then(_=>{
      let subjectMap = names.map((subject, i) => {
        return <option key ={i} name = {subject['name']} value = {subject['docRef']}> {subject['name']}</option>
      });
      this.setState({subjects: subjectMap, subjectSnapshotMap: docSnapMap});
    })
  }

  getCategories(){
    let categories = []
    let promises = []
    let docSnapMap = {}
    categories.push({name: "Select a Category", docRef: ""})
    promises.push(this.props.firebase.db.collection('categories').get().then(result=>{
      result.docs.forEach(doc=>{
        let category = {name: doc.get('name'), docRef: doc.ref.path}
        docSnapMap[doc.ref.path] = doc.ref
        categories.push(category)
      })
    }))
    return Promise.all(promises).then(_=>{
      let categoryMap = categories.map((category, i) => {
        return <option key ={i} name = {category['name']} value = {category['docRef']}> {category['name']}</option>
      });
      this.setState({categories: categoryMap, categorySnapshotMap: docSnapMap});
    })
  }

  getDefaultColDef () {
    return {
      sortable: true
    };
  }

  getColumn(){
    return[
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
        headerName: "Assessor",
        field: "assessor",
        resizable: true
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

  handleChange (){

    if(this.state.subjectDocRef === ""){
      this.setState({rowData:[]});
    }else if(this.state.currentCategoryRef === ""){
        this.setState({rowData:[]})
    }else{
      return manageScore.getRows(this.props.firebase.db, this.state.subjectSnapshotMap[this.state.subjectDocRef]
              ,this.state.categorySnapshotMap[this.state.currentCategoryRef]).then(rows =>{
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
        <Form.Row className="align-items-end">
          <Col>
            <Form.Group>
              <Form.Label>Select a Subject:</Form.Label>
              <Form.Control as="select"
                id = "subject"
                placeholder = "Select a Subject"
                title = "Subject"
                onChange={_ => {
                    this.setState({subjectDocRef : document.getElementById('subject').value},() => {
                      this.handleChange()
                    });
                }}
                children = {this.state.subjects}
                >
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Select a Category:</Form.Label>
              <Form.Control as="select"
                id = "category"
                placeholder = "Select a Category"
                title = "Category"
                onChange={_ => {
                    this.setState({currentCategoryRef : document.getElementById('category').value},() => {
                      this.handleChange()
                    });
                }}
                children = {this.state.categories}
                >
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm={'auto'}>
            <Form.Group>
              {
                this.state.subjectDocRef==="" ?
                <Button variant="secondary" disabled>Add Score</Button> :
                <Button onClick={_=>this.setState({sidebarOpen:true})}>Add Score</Button>
              }
            </Form.Group>
          </Col>
        </Form.Row>
        <AgGridReact
          style={{maxWidth:"100%"}}
          defaultColDef = {this.state.defaultColDef}
          columnDefs = {this.state.columnDefs}
          rowData = {this.state.rowData}
          onGridReady={params=>{
            params.api.sizeColumnsToFit();
            this.setState({gridOptions : params});
          }}
        />
        {
          this.state.sidebarOpen ?
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
          : null
        }
      </div>
    );
  }
}

const Report = withFirebase(ReportBase);
export default Report;
