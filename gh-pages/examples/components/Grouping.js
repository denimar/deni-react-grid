import React from 'react';
import DataGrid from '../../../src/components/DataGrid';
import './BasicGrid.scss';

class Grouping extends React.Component {

  gridOptions() {
    return {
      url: 'https://denifakedata.herokuapp.com/employees/1000',
      grouping: {
          expr: 'address.city',
          template: '<b>{address.city} - {address.state}</b> ({count})'
      },
      columns: [{
          header: 'Name',
          name: 'name',
          width: '30%',
      }, {
          header: 'Company',
          name: 'company',
          width: '30%',
      }, {
          header: 'City',
          name: 'address.city',
          width: '30%',
      }, {
          header: 'Age',
          name: 'age',
          width: '10%',
          align: 'right'
      }]
    }
  }

  render() {
    return (
      <DataGrid className="basic-grid" options={ this.gridOptions() } />
    );
  }
}

export default Grouping;
