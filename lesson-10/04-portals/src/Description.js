import React from 'react'
import { createPortal } from 'react-dom'

class Description extends React.Component {
  render() {
    const { price, desc } = this.props

    return createPortal(
      <>
        <p>Price: {price}</p>
        <p>Description: {desc}</p>
      </>,
      document.querySelector('#itemDescription')
    )
  }
}

export default Description
