import React from 'react';
import './DataGridBody.scss';

class DataGridBody extends React.Component {

  render() {

    return (
      <div className="ui-body-viewport-wrapper">
        <div className="ui-body-viewport">
          <div className="ui-body-container">
          </div>
        </div>
      </div>
    );

  }

}

export default DataGridBody;
