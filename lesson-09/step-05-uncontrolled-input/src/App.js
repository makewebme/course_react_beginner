import React from 'react'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  handleSubmit = (e) => {
    alert('A name was submitted: ' + this.input.current.value)
    e.preventDefault()
  }

  render = () => (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input type='text' ref={this.input} />
      </label>

      <input type='submit' value='Submit' />
    </form>
  )
}

export default App
