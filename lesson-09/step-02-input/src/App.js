import React from 'react'
import './App.css'

class App extends React.Component {
  state = { value: '' }

  handleChange = ({ target: { value } }) => this.setState({ value })

  handleSubmit = () => alert('A name was submitted: ' + this.state.value)

  render = () => (
    <form>
      <label>
        Name:
        <input type='text' value={this.state.value} onChange={this.handleChange} />
      </label>

      <button type='button'>Send</button>
    </form>
  )
}

export default App
