import React from 'react'
import CustomBtn from './CustomBtn'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    console.log(this.ref.current)
    setTimeout(() => {
      this.ref.current.changeSendingStatus()
    }, 2000)
  }

  render() {
    return (
      <div className='wrapper'>
        <CustomBtn ref={this.ref}>
          SENDING...
        </CustomBtn>
      </div>
    )
  }
}

export default App