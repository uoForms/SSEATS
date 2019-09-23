import React from 'react';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { withFirebase } from '../firebase/context';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class ViewSubjectsAssessmentsBase extends React.Component {
        constructor(props){
        super(props);

        this.state = {
            subjectDocRef : "",
            subjects: [],
            subjectSnapshotMap : {},
            assessmentList : [],
            defaultColDef: this.getDefaultColDef(),
            columnDefs : this.getColumn(),
            gridOptions : null,
            rowData: [],
        }
    }

    componentWillMount(){
        this.getSubjects();
    }

    getSubjects(){
        let names = []
        let promises = []
        let docSnapMap = {}
        names.push({name: "Select a Subject", docRef: ""});
        
        return this.props.firebase.getViewableSubjectRefs().then((refs) => {
          // Turn the refs into usable information
          refs.forEach((ref) => {
            promises.push(
              ref.get().then((doc) => {
                let subject = {name: doc.get('name'), docRef: doc.ref.path};
                docSnapMap[doc.ref.path] = doc.ref;
                names.push(subject);
              })
            );
          });
        }).then (() => {
          // Wait for all document fetches to end, then convert to options
          return Promise.all(promises).then(_=>{
            let subjectMap = names.map((subject, i) => {
              return <option key ={i} name = {subject['name']} value = {subject['docRef']}> {subject['name']}</option>
            });
            this.setState({subjects: subjectMap, subjectSnapshotMap: docSnapMap});
          })
        });
    }

    handleChange (){
    //Get all the subjects assessments
        if(this.state.subjectDocRef === ""){
            let emptyArray = [];
            this.setState({asssesmentList: emptyArray, rowData: emptyArray});
        }else{
            let subjectRef = this.state.subjectDocRef.split("/");
            let assessmentsList = [];
            this.props.firebase.getSubjectAssessments(subjectRef[1]).then((refs) => {
                assessmentsList = refs;
            }).then(() => {
                this.setState({asssesmentList: assessmentsList, rowData: assessmentsList});
            })
        }
    }


    getDefaultColDef () {
        return {
          sortable: true
        };
      }
    
      getColumn(){
        return[
          {
            headerName: "Category Name",
            field : "categoryName"     ,
            resizable : true
          },
          {
            headerName: "Date",
            field : "date",
            resizable : true
          },
          {
            headerName: "Entry Type",
            field : "entry_type",
            resizable : true
          }
        ]
      }


    render() {
        return (
            <div className="ag-theme-balham"
                 style = {{flex:1, height:'80vh', width: '80%', margin: '2rem auto'}}>
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
                </Form.Row>
                Assessments
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
            </div>
        );
    }
}
const ViewSubjectsAssessments = withFirebase(ViewSubjectsAssessmentsBase);
export default ViewSubjectsAssessments;
