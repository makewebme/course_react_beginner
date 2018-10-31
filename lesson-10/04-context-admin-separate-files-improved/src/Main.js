import React from 'react'
import Button from './Button'

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

export default Main
