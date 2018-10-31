import React from 'react'
import Item from './Item'

import pig from './img/pig.jpg'
import notebook from './img/notebook.png'
import car from './img/car.png'

class App extends React.Component {
  items = [
    {
      image: pig,
      price: 1000,
      desc: 'Nice little pig'
    },
    {
      image: notebook,
      price: 80000,
      desc: 'Comfortale notebook with high performance'
    },
    {
      image: car,
      price: 10000000,
      desc: 'Lux sport car'
    }
  ]

  render() {
    return (
      <>
        <h1>Things Shop</h1>

        <div className='appWrapper cont'>
          {this.items.map((item) => <Item item={item} />)}
        </div>

        <p className='cont'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde fugiat voluptate molestiae repellat ducimus consequatur quaerat itaque quod, ex voluptas reiciendis aliquam quisquam ab, soluta nemo velit consectetur, et sapiente!
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde fugiat voluptate molestiae repellat ducimus consequatur quaerat itaque quod, ex voluptas reiciendis aliquam quisquam ab, soluta nemo velit consectetur, et sapiente!
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde fugiat voluptate molestiae repellat ducimus consequatur quaerat itaque quod, ex voluptas reiciendis aliquam quisquam ab, soluta nemo velit consectetur, et sapiente!
        </p>
      </>
    )
  }
}

export default App
