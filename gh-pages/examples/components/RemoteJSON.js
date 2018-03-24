import React from 'react';
import DataGrid from '../../../src/components/DataGrid';
import './RemoteJSON.scss';

class RemoteJSON extends React.Component {

  gridOptions() {
    return {
      url: 'https://denifakedata.herokuapp.com/employees/1000',
      paging: {
          pageSize: 10
      },
      columns: [
        {
          header: 'Name',
          name: 'name',
          width: '50%',
        },
        {
          header: 'Gender',
          name: 'gender',
          width: '30%',
        },
        {
          header: 'Age',
          name: 'age',
          width: '20%',
          align: 'right'
        }
      ]
    }
  }

  render() {
    return (
      <DataGrid className="remote-json-grid" options={ this.gridOptions() } />
    );
  }
}

export default RemoteJSON;
