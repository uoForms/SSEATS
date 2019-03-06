import React, { Component } from 'react';
import Header from './header.jsx'
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import Routes from './routes.jsx'

class Report extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      columnDefs : [
        {headerName: "Name", field : " name"}

      ],
      rowData:[
        {Name: "Test"}
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

export default App;