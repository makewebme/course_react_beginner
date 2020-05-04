
//
// Class components with setState
//

// import React from 'react'

// class SetState extends React.Component {
//   state = {
//     count: 0
//   }

//   render() {
//     const { count } = this.state

//     return (
//       <div>
//         <p>You clicked {count} times</p>

//         <button onClick={_ => this.setState({ count: count + 1})}>
//           Click me
//         </button>
//       </div>
//     )
//   }
// }

// export default SetState




















//
// useState Hook
//

import React, { useState } from 'react'

const UseStateHook = () => {
  const [ count, setCount ] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default UseStateHook
