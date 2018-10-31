import React from 'react'

import Header from './Header'
import Main from './Main'
import Sidebar from './Sidebar'

import ThemeContext from './ThemeContext'

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
      <ThemeContext.Provider value={{
        themeColor: this.state.themeColor,
        changeThemeColor: this.changeThemeColor
      }}>
        <div className='appWrapper'>
          <Header />
          <Main />
          <Sidebar />
        </div>
      </ThemeContext.Provider>
    )
  }
}

export default App
