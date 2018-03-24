import React from 'react'
import BasicGrid from './BasicGrid'
import Pagging2 from './Pagging2'
import RemoteJSON from './RemoteJSON'
import Grouping from './Grouping'
import FixedColumnsWithRowNumber from './FixedColumnsWithRowNumber'

class Examples extends React.Component {

  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <FixedColumnsWithRowNumber />
      </div>
    )

  }

}

export default Examples;
