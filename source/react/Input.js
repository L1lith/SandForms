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
    this.childProps = { ...props }
    // Prevent The Props from being interpreted as options when using vanilla mode
    if (this.childProps.vanilla === true || (typeof this.childProps.type == 'string' && !allowedInputTypes.includes(this.childProps.type))) {
      this.options = { vanilla: true }
      delete this.childProps.vanilla
      delete this.childProps._hook
      return
    }
    // Interpret the options from the props
    this.options = {}
    this.sandhands = { _: String }
    Object.keys(this.props).forEach(prop => {
      if (sandhandsOptions.includes(prop)) {
        this.sandhands[prop] = this.childProps[prop]
        delete this.childProps[prop]
      } else if (inputOptions.includes(prop)) {
        this.options[prop] = this.childProps[prop]
        delete this.childProps[prop]
      }
    })
    this.useSandhands = Object.keys(this.sandhands).length > 0
    if (typeof this.childProps._hook == "function") this.childProps._hook(this)
    delete this.childProps._hook
    // Get the input ref
    if (typeof this.childProps.ref == "function") {
      const propRefHandler = this.childProps.ref
      this.childProps.ref = ref => {
        propRefHandler(ref)
        this.input = ref
      }
    } else {
      this.childProps.ref = ref => (this.input = ref)
    }
  }
  validateOptions() {
    const { vanilla, validate, onError } = this.options
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
    // Render vanilla input if the vanilla prop is passed as true
    if (this.options.vanilla === true) return createElement("input", this.childProps)
    return createElement("input", this.childProps)
  }
}

module.exports = Input
