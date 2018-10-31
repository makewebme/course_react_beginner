import React from 'react'
import ThemeContext from './ThemeContext'

class Button extends React.Component {
  static contextType = ThemeContext

  render() {
    return (
      <button
        style={{ backgroundColor: this.context.themeColor }}
        className={this.props.active ? 'btnActive' : ''}
        onClick={this.props.clickHandler ? this.props.clickHandler : () => {}}
      >
        {this.props.text}
      </button>
    )
  }
}

export default Button
