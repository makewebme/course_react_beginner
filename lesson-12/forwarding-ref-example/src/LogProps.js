// import React from 'react'

// function logProps(WrappedComponent) {
//   class LogProps extends React.Component {
//     componentDidMount(prevProps) {
//       console.log('old props:', prevProps)
//       console.log('new props:', this.props)
//     }

//     render() {
//       return <WrappedComponent {...this.props} />
//     }
//   }

//   return LogProps
// }

// export default logProps















// import React from 'react'

// function logProps(WrappedComponent) {
//   class LogProps extends React.Component {
//     componentDidMount(prevProps) {
//       console.log('old props:', prevProps)
//       console.log('new props:', this.props)
//     }

//     render() {
//       const {forwardedRef, ...rest} = this.props
//       return <WrappedComponent ref={forwardedRef} {...rest} />
//     }
//   }

//   return React.forwardRef((props, ref) => {
//     return <LogProps {...props} forwardedRef={ref} />
//   })
// }

// export default logProps












// import React from 'react'

// function logProps(WrappedComponent) {
//   class LogProps extends React.Component {
//     componentDidMount(prevProps) {
//       console.log('old props:', prevProps)
//       console.log('new props:', this.props)
//     }

//     render() {
//       const {forwardedRef, ...rest} = this.props
//       return <WrappedComponent ref={forwardedRef} {...rest} />
//     }
//   }

//   return React.forwardRef(function CustomBtn (props, ref) {
//     return <LogProps {...props} forwardedRef={ref} />
//   })
// }

// export default logProps












import React from 'react'

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidMount(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }

    render() {
      const {forwardedRef, ...rest} = this.props
      return <WrappedComponent ref={forwardedRef} {...rest} />
    }
  }

  function forwardRef (props, ref) {
    return <LogProps {...props} forwardedRef={ref} />
  }

  const name = WrappedComponent.displayName || WrappedComponent.name
  forwardRef.displayName = `logProps(${name})`

  return React.forwardRef(forwardRef)
}

export default logProps












