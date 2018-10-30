import React from 'react'

import Header from './Header'
import Main from './Main'
import Sidebar from './Sidebar'

const { Provider, Consumer } = React.createContext()

class App extends React.Component {
  state = {
    themeColor: '#55aa77'
  }

  changeThemeColor = (newColor) => {
    this.setState({
      themeColor: newColor
    })
  }

  render() {
    return (
      <Provider value={{
        themeColor: this.state.themeColor,
        changeThemeColor: this.changeThemeColor
      }}>
        <div className='appWrapper'>
          <Header />
          <Main />
          <Sidebar />
        </div>
      </Provider>
    )
  }
}

export { Consumer }

export default App
