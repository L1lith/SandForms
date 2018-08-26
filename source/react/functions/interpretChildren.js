const {cloneElement, createElement, Children} = require('react')

const elementMap = {
  'input': require('../Input')
}

function interpretChildren(inputChildren, hook) {
  return Children.map(inputChildren, (child, index) => {
    if (child === null) return null
    const props = {...(child.props || {}), key: index}
    if (typeof child.type == 'string' && elementMap.hasOwnProperty(child.type)) {
      if (child.type === 'input') props._hook = hook
      return createElement(elementMap[child.type], props)
    }
  })
}

module.exports = interpretChildren
