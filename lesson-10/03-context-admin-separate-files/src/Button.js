import React from 'react'
import { Consumer } from './App'

class Button extends React.Component {
  render() {
    return (
      <Consumer>
        {({ themeColor }) => (
          <button
            style={{ backgroundColor: themeColor }}
            className={this.props.active ? 'btnActive' : ''}
            onClick={this.props.clickHandler ? this.props.clickHandler : () => {}}
          >
            {this.props.text}
          </button>
        )}
      </Consumer>
    )
  }
}

export default Button
