import React from 'react'
import './App.css'

class App extends React.Component {
  state = {
    studying: true,
    grade: 2
  }

  handleChange = ({ target: { type, checked, value, name } }) => {
    this.setState({
      [name]: type === 'checkbox' ? checked : value
    })
  }

  render = () => (
    <form>
      <label>
        Is studying:

        <input
          name='studying'
          type='checkbox'
          checked={this.state.studying}
          onChange={this.handleChange}
        />
      </label>

      <br />

      <label>
        Your grade:

        <input
          name='grade'
          type='number'
          value={this.state.grade}
          onChange={this.handleChange}
        />
      </label>
    </form>
  )
}

export default App
