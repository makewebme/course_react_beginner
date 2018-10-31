import React from 'react'
import { findDOMNode } from 'react-dom'
import Description from './Description'

class Item extends React.Component {
  state = {
    descriptionVisible: false
  }

  toggleDescription = (visibility) => {
    this.setState((state) => ({
      descriptionVisible: visibility
    }))

    const desc = document.querySelector('#itemDescription')
    const { x, y, width, height } = findDOMNode(this).getBoundingClientRect()

    if (visibility) {
      desc.classList.add('visible')
      desc.style.left = `${x}px`
      desc.style.top = `${y + height}px`
      desc.style.width = `${width}px`
    } else {
      desc.classList.remove('visible')
    }
  }

  render() {
    const { image, price, desc } = this.props.item

    return (
      <div
        className='item'
        onMouseEnter={this.toggleDescription.bind(this, true)}
        onMouseLeave={this.toggleDescription.bind(this, false)}
      >
        <img className='image' src={image} />
        {
          this.state.descriptionVisible
          ? <Description price={price} desc={desc} /> : null
        }
      </div>
    )
  }
}

export default Item
