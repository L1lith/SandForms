const { Component, createElement } = require("react")
const { sanitize } = require("sandhands")
let sandhandsOptions = require("sandhands/source/validate/allowedOptions")
sandhandsOptions = sandhandsOptions.primitives
  .get(String)
  .concat(sandhandsOptions.universal)

const inputOptions = ["onError"]
const allowedInputTypes = ['text', 'password', 'email', 'search']

class Input extends Component {
  constructor(props) {
    super(props)
  }
  interpretProps(props=this.props) {
    let sandhands = { _: String }
    let childProps = { ...props }
    let options = {useSandhands: false}
    delete childProps.vanilla
    delete childProps._hook
    // Prevent The Props from being interpreted as options when using vanilla mode
    if (props.vanilla === true || (typeof childProps.type == 'string' && !allowedInputTypes.includes(childProps.type))) {
      options.vanilla = true
    } else {
      // Interpret the options from the props
      Object.keys(props).forEach(prop => {
        if (sandhandsOptions.includes(prop)) {
          sandhands[prop] = childProps[prop]
          delete childProps[prop]
        } else if (inputOptions.includes(prop)) {
          options[prop] = childProps[prop]
          delete childProps[prop]
        }
      })
      options.useSandhands = Object.keys(sandhands).length > 0
      if (typeof props._hook == "function") props._hook(this)
      // Get the input ref
      if (typeof childProps.ref == "function") {
        const propRefHandler = childProps.ref
        childProps.ref = ref => {
          propRefHandler(ref)
          this.input = ref
        }
      } else {
        childProps.ref = ref => {this.input = ref}
      }
    }
    return {sandhands, childProps, options}
  }
  validateOptions(options) {
    const { vanilla, validate, onError } = options
    if (this.options.hasOwnProperty("vanilla") && typeof vanilla != "boolean") throw new Error("Vanilla must be a boolean value")
    if (this.options.hasOwnProperty("validate") && validate !== null && !(typeof validate == "object" || typeof validate == "function" || (Array.isArray(validate) && validate.every(value => typeof value == "function")))) throw new Error("Validate must be an object, a function, or an array of functions")
    if (this.options.hasOwnProperty("onError") && typeof onError != "function") throw new Error("onError must be a function")
  }
  sanitize() {
    if (this.useSandhands !== true) return
    if (!(this.input instanceof HTMLElement)) throw new Error("Can't find input ref!")
    try {
      sanitize(this.input.value, this.sandhands)
    } catch (error) {
      if (this.options.onError) this.options.onError(error.message)
      return error
    }
  }
  render() {
    const {options, sandhands, childProps} = this.interpretProps(this.props)
    validateOptions(options)
    const {useSandhands, vanilla} = options
    return createElement("input", childProps)
  }
}

module.exports = Input
