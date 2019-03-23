import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { withFirebase } from '../firebase/context'

class ReportBase extends React.Component {
  constructor(props){
    super(props);

    //this.auth = app.auth();
    //this.db = app.database();

    this.state = {

      columnDefs : [
        {headerName: "Name", field : "name"},
        {headerName: "Score", field : "score"},
        {headerName: "Comment", field : "comment"},
      ],
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
  }


  render() {
    return (
      <div className="ag-theme-balham"
        style = {{ height: '200px', width: '600px'}}
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
