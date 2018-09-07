import React from 'react'
import Card from './Card'
import './App.css'

const users = [
  {
    name: 'Alex Feel',
    age: 29,
    specialty: 'Animator'
  },
  {
    name: 'Nick Kras',
    age: 27,
    specialty: 'Programmer'
  },
  {
    name: 'Dmitry Put',
    age: 26,
    specialty: 'Art Director'
  }
]

class App extends React.Component {
  render() {
    return (
      <div className='wrapper'>
        {users.map((user, i) => <Card key={i} {...user} />)}
      </div>
    )
  }
}

export default App
