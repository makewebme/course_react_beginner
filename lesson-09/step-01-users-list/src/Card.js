import React from 'react'

const Card = (props) => {
  const { name, age, specialty, keyValue } = props

  return (
    <div className='item' key={keyValue}>
      <img src='http://i.pravatar.cc/300' alt='' />
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Specialty: {specialty}</p>
    </div>
  )
}

export default Card