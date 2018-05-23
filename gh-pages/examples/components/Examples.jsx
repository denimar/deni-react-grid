import React from 'react'
import BasicGrid from './BasicGrid'
import Pagging2 from './Pagging2'
import RemoteJSON from './RemoteJSON'
import Grouping from './Grouping'
import FixedColumnsWithRowNumber from './FixedColumnsWithRowNumber'
import ActionColumn from './ActionColumn'

class Examples extends React.Component {

  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <BasicGrid />
      </div>
    )

  }

}

export default Examples;
