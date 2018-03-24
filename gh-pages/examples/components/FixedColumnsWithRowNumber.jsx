import React from 'react';
import DataGrid from '../../../src/components/DataGrid';
import './BasicGrid.scss';

class FixedColumnsWithRowNumber extends React.Component {

  gridOptions() {
    return {
      url: 'https://denifakedata.herokuapp.com/movies/500',
      fixedCols: {
        rowNumber: true,
        indicator: true
      },
      columns: [{
            header: 'Id',
            name: 'id',
            width: '90px',
            align: 'right',
        }, {
            header: 'Title',
            name: 'title',
            width: '200px',
            align: 'left',
        }, {
            header: 'Popularity',
            name: 'popularity',
            width: '120px',
            align: 'right'
        }, {
            header: 'Release',
            name: 'release_date',
            width: '130px',
            align: 'center'
        }, {
            header: 'Votes',
            name: 'vote_count',
            width: '80px',
            align: 'center'
        }
      ]
    }
  }

  render() {
    return (
      <DataGrid className="basic-grid" options={ this.gridOptions() } />
    );
  }
}

export default FixedColumnsWithRowNumber;
