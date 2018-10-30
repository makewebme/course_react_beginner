import React from 'react'
import Button from './Button'

const Header = () => (
  <div className='sectionHeader'>
    <Button active text='Your orders' />
    <Button text='Settings' />
    <Button text='Logout' />
  </div>
)

export default Header
