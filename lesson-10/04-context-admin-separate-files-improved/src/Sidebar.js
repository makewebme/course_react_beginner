import React from 'react'
import Button from './Button'
import ThemeContext from './ThemeContext'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  static contextType = ThemeContext

  handleChangeColor = () => {
    const value = this.input.current.value
    this.input.current.value = ''

    if (value.match(/^#[0-9,A-F]{6}$/i)) {
      this.context.changeThemeColor(value)
    } else {
      return
    }
  }

  render() {
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
        <Button text='Change' clickHandler={this.handleChangeColor} />
      </div>
    )
  }
}

export default Sidebar
