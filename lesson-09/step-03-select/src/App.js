import React from 'react'
import './App.css'

class App extends React.Component {
  state = { value: '' }

  handleChange = ({ target: { value } }) => this.setState({ value })

  handleSubmit = () => alert('A name was submitted: ' + this.state.value)

  render = () => (
    <form>
      <select value={this.state.value} onChange={this.handleChange}>
        <option value='php'>PHP</option>
        <option value='nodejs'>NodeJS</option>
        <option value='ruby'>Ruby</option>
        <option value='python'>Python</option>
      </select>

      <button type='button'>Select backend language</button>
    </form>
  )
}

export default App
