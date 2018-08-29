const {cloneElement, createElement, Children} = require('react')

const Input = require('./input')

function interpretChildren(inputChildren, hook) {
  return Children.map(inputChildren, (child, index) => {
    if (child === null) return null
    const props = {...(child.props || {}), key: index}
    if (child.type instanceof Input) {
      props._hook = hook
      return createElement(Input, props)
    }
    return cloneElement(child, props)
  })
}

module.exports = interpretChildren
