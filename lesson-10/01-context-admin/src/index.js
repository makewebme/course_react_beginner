import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'

const ThemeContext = React.createContext()

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value={{ themeColor: '#55aa77' }}>
        <div className='appWrapper'>
          <Header />
          <Main />
          <Sidebar />
        </div>
      </ThemeContext.Provider>
    )
  }
}

const Header = () => (
  <div className='sectionHeader'>
    <Button active text='Your orders' />
    <Button text='Settings' />
    <Button text='Logout' />
  </div>
)

const orders = [
  {
    date: '02.08.17',
    amount: '2500',
    buyerName: 'Evgeniy Egelsky'
  },
  {
    date: '17.11.17',
    amount: '1500',
    buyerName: 'Alex Feel'
  },
  {
    date: '20.05.18',
    amount: '3000',
    buyerName: 'Rite Timo'
  }
]

const Main = () => (
  <div className='sectionMain'>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount, rub</th>
          <th>Buyer name and surname</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, i) => (
          <tr key={i}>
            <td>{order.date}</td>
            <td>{order.amount}</td>
            <td>{order.buyerName}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <Button text='Show more..' />
  </div>
)

const Sidebar = () => (
  <div className='sectionSidebar'>
    <p className='usersOnline'>Users online: 1572</p>
    <Button text='Go to chat..' />
  </div>
)

class Button extends React.Component {
  static contextType = ThemeContext

  render() {
    return (
      <button
        style={{ backgroundColor: this.context.themeColor }}
        className={this.props.active ? 'btnActive' : ''}
      >
        {this.props.text}
      </button>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
