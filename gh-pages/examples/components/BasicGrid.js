import React from 'react';
import DataGrid from '../../../src/components';
import './BasicGrid.scss';

class BasicGrid extends React.Component {

  _onTestingClick() {
    this.grid.api.removeSelectedRows()
  }

  gridOptions() {
    return {
      columns: [
        {
          header: 'Name',
          name: 'name',
          width: '55%',
        },
        {
          header: 'Gender',
          name: 'gender',
          width: '25%'
        },
        {
          header: 'Age',
          name: 'age',
          width: '20%',
          align: 'right'
        }
      ],
      data: [
        {
          "name": "Jack Nicholson",
          "gender": "male",
          "age": 79,
        },
        {
          "name": "Julia Roberts",
          "gender": "female",
          "age": 48,
        },
        {
          "name": "Robert De Niro",
          "gender": "male",
          "age": 72,
        },
        {
          "name": "Jennifer Lawrence",
          "gender": "female",
          "age": 25,
        },
        {
          "name": "Sylvester Stallone",
          "gender": "male",
          "age": 69,
        }
      ]
    }
  }

  render() {
    return (
      <div>
        <button onClick={ this._onTestingClick.bind(this) }>Testing</button>
        <DataGrid 
          ref={ elem => { this.grid = elem } }
          className="basic-grid" options={ this.gridOptions() } 
        />
      </div>
    );
  }
}

export default BasicGrid;
