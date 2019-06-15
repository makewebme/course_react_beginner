import React from 'react'
import logProps from './LogProps'

class CustomBtn extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  changeSendingStatus = _ => this.ref.current.innerText = 'SENT'

  render() {
    return (
      <button className='custom-btn' ref={this.ref}>
        {this.props.children}
      </button>
    )
  }
}

export default logProps(CustomBtn)