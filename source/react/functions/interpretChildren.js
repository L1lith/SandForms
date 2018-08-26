const {cloneElement, createElement} = React = require('react')

const elementMap = {
  'input': require('../Input')
}

function interpretChildren(children) {
  return React.Children.map(children, (child, index) => {
    const props = {...child.props, key: index}
    if (typeof child.type == 'string' && elementMap.hasOwnProperty(child.type)) {
      return createElement(elementMap[child.type], props)
    }

    return cloneElement(child, props)
  })
}

module.exports = interpretChildren
