import React from 'react';
import DataGrid from '../../../src/components/DataGrid';
import './Pagging2.scss';

class Pagging2 extends React.Component {

  gridOptions() {
    return {
      rowHeight: '72px',
      url: 'https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=7a0a0327bf5041c8a4cf40301ac0b1d1',
      restConfig: {
          data: 'results',
          total: 'num_results',
          start: 'offset',
          limit: 'limit'
      },
      paging: {
          pageSize: 20
      },
      columns: [{
          header: 'Type',
          name: 'item_type',
          width: '7%',
      }, {
          header: 'Section',
          name: 'section',
          width: '9%'
      }, {
          header: 'Sub Section',
          name: 'subsection',
          width: '14%',
      }, {
          header: 'Published',
          name: 'published_date',
          width: '10%',
          format: 'date',
          align: 'center'
      }, {
          header: 'Title',
          name: 'title',
          width: '60%',
          renderer: function(value, record, columns, rowIndex) {
              //url, source
              var html = '';
              var descriptionWidth = '402px';
              if (record.thumbnail_standard) {
                  html += '<img class="img-news" src="' + record.thumbnail_standard + '" />\n';
              } else {
                  descriptionWidth = '452px';
              }

              html += '<div style="width:' + descriptionWidth + '" class="description-news">\n' +
                  '  <div class="title-news"><a href="' + record.url + '" target="_blank">' + value + '</a></div>\n' +
                  '  <div class="title-abstract">' + record.abstract + '</div>\n' +
                  '</div>';
              return html;
          }
      }]
    }
  }

  render() {
    return (
      <DataGrid className="pagging2-grid" options={ this.gridOptions() } />
    );
  }
}

export default Pagging2;
