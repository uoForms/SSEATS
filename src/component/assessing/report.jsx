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
import ScoreColour from './scoreColour.jsx'


class ReportBase extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      subjectDocRef : "",
      subjects: [],
      // scores of the category, key is the category
      scores: {},
      subjectSnapshotMap : {},
      currentCategoryRef:"",
      categories: [],
      categorySnapshotMap: {},
      defaultColDef: this.getDefaultColDef(),
      columnDefs : this.getColumn(),
      gridOptions : null,
      rowData: [],
      sidebarOpen: false,
      colourGradients: []
    }
  }

  componentWillMount() {
    this.getSubjects();
    this.getCategories();
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

  async getScoreData(score) {
    let score_doc = await score.get();
    return score_doc.data()
  }

  async mapScores (report_type) {
    let scores = await report_type.get("scores");
    return await Promise.all(scores.map(score => {
      let thing = this.getScoreData(score)
      return thing
    }
    ));
  }
  

  async getCategories() {
    let categories = [];
    let promises = [];
    let scores_map = {};
    let docSnapMap = {};
    categories.push({name: "Select a Category", docRef: ""});
    promises.push(this.props.firebase.db.collection('categories').get().then(async (result) =>{
      await Promise.all(result.docs.map(async (doc)=>{
        let report_type = await doc.get("report_type").get();
        let scores = await this.mapScores(report_type);
        let category = {
          name: doc.get('name'), 
          docRef: doc.ref.path,
        };
        scores_map[doc.ref.path] = scores;
        docSnapMap[doc.ref.path] = doc.ref;
        categories.push(category);
      }));
    }))
    return Promise.all(promises).then(_=>{
      let categoryMap = categories.map((category, i) => {
        return <option key ={i} name = {category['name']} value = {category['docRef']}> {category['name']}</option>
      });
      this.setState({categories: categoryMap, categorySnapshotMap: docSnapMap, scores: scores_map});
    })
  }

  getDefaultColDef () {
    return {
      sortable: true
    };
  }

  getColumn(){
    let columns = [
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
    ];

    if(this.state) {
      let scores = this.state.scores[this.state.currentCategoryRef];
      if(scores) {
        let colours = []
        scores.forEach((score) => {
          // Create the colour gradient maps here
          colours.push({
            name : score.name,
            valueMap : (s=>{
              let gradient = {};
              let rgb = (r, g, b)=>('#'+(r).toString(16).padStart(2,'0')+(g).toString(16).padStart(2,'0')+(b).toString(16).padStart(2,'0'));
              gradient[s['null']] = rgb(128, 128, 128);
              // Inverse min and max if needed and adjust interval
              let s_min = Math.min(s.min, s.max);
              let s_max = Math.max(s.min, s.max);
              for (let i = s_min;i <= s_max; i += Math.abs(s.interval))
              {
                let j = Math.floor((s_max-i)*255/s_max)
                // Reverse index if min and max were swapped
                gradient[s.min===s_min?i:s_max+s_min-i] = rgb(j,255-j,0);
              }
              return gradient;
            })(score)
          });
          // Add score to the table
          columns.push({
            headerName: score.name,
            field: score.name,
            cellRenderer:"scoreColour",
            resizable: true,
          });
        });
        this.setState({colourGradients:colours})
      }
    }

    columns.push({
      headerName: "Comment",
      field : "comment",
      resizable : true
    });
    return columns;
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
              ,this.state.categorySnapshotMap[this.state.currentCategoryRef], 
              this.state.scores[this.state.currentCategoryRef]).then(rows =>{
                // Create columns first to create the colour gradient.
                let columns = this.getColumn();
                rows.forEach(r=>this.state.colourGradients.forEach(c=>
                  {
                    r[c.name] = {
                      number:r[c.name],
                      colour:c.valueMap[r[c.name]]
                    }
                  }));
        this.setState({
          rowData: rows,
          columnDefs: columns,
        },_=>{
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
          frameworkComponents = {{scoreColour:ScoreColour}}
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
            sidebar={<AddScore subjectDocumentReference={this.props.firebase.db.doc(this.state.subjectDocRef)} selectedCategory={this.state.currentCategoryRef} exit={_=>{
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
