import React from 'react'
import Button from './Button'
import { Consumer } from './App'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  handleChangeColor = (e, changeThemeColor) => {
    const value = this.input.current.value
    this.input.current.value = ''

    if (value.match(/^#[0-9,A-F]{6}$/i)) {
      changeThemeColor(value)
    } else {
      return
    }
  }

  render() {
    return (
      <Consumer>
        {({ changeThemeColor }) => {
          return (
            <div className='sectionSidebar'>
              <p className='usersOnline'>Users online: 1572</p>
              <Button text='Go to chat..' />
              <hr/>

              <p>Change color to:</p>
              <label>
                <input ref={this.input} placeholder='Full HEX color..' />
              </label>
              <br/><br/>
              <Button text='Change' clickHandler={e => this.handleChangeColor(e, changeThemeColor)} />
            </div>
          )
        }}
      </Consumer>
    )
  }
}

export default Sidebar
