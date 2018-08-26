const {Component} = require('react')
const {validate} = require('sandhands')
let sandhandsOptions = require('sandhands/source/validate/allowedOptions')
sandhandsOptions = sandhandsOptions.primitives.get(String).concat(sandhandsOptions.universal)

const inputOptions = []

class Input extends Component {
  constructor(props) {
    super(props)
    this.childProps = {...props}
    // Prevent The Props from being interpreted as options when using vanilla mode
    if (this.childProps.vanilla === true) {
      this.options = {vanilla: true}
      delete this.childProps.vanilla
      return
    }
    // Interpret the options from the props
    this.options = {}
    this.sandhands = {}
    Object.entries(this.props).forEach(prop => {
      if (sandhandsOptions.hasOwnProperty(prop)) {
        this.sandhands[prop] = this.childProps[prop]
        delete this.childProps[prop]
      } else if (inputOptions.hasOwnProperty(prop)) {
        this.options[prop] = this.childProps[prop]
        delete this.childProps[prop]
      }
    })
    this.useSandhands = Object.keys(this.sandhands).length > 0
  }
  validateOptions() {
    const {vanilla, validate, onError} = this.options
    if (this.options.hasOwnProperty('vanilla') && typeof vanilla != 'boolean') throw new Error("Vanilla must be a boolean value")
    if (this.options.hasOwnProperty('validate') && validate !== null && !(typeof validate == 'object' || typeof validate == 'function' || (Array.isArray(validate) && validate.every(value => typeof value == 'function')))) throw new Error("Validate must be an object, a function, or an array of functions")
    if (this.options.hasOwnProperty('onError') && typeof onError != 'function') throw new Error('onError must be a function')
  }
  render() {
    // Render vanilla input if the vanilla prop is passed as true
    if (this.options.vanilla === true) return React.createElement('input', this.childProps)
    return React.createElement('input', this.childProps)
  }
}

module.exports = Input
