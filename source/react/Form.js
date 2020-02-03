const { Component, createElement } = require("react")
const React = require("react")
const autoBind = require("auto-bind")
const interpretChildren = require("./functions/interpretChildren")
const titleCase = require('./functions/titleCase')

const allowedFormProps = ["onSubmit", "onError", "displayErrors", "displayError", "catchSubmit"]

class Form extends Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {errorDisplay: null}
    this.displayErrorFunction = errorMessage =>{
      if (typeof errorMessage != 'string' && !(errorMessage instanceof Error)) throw new Error("Error to Display must be a string or an Error object")
      if (errorMessage instanceof Error) errorMessage = "Error: " + errorMessage.message
      this.setState({errorDisplay: errorMessage})
    }
  }
  onError(error, element=null) {
    if (this.props.displayErrors !== false) {
      let errorDisplay = error.message
      if (element.name) {
        errorDisplay = titleCase(element.name) + ": " + errorDisplay
      } else {
        errorDisplay = "Error: " + errorDisplay
      }
      this.setState({errorDisplay})
    }
    if (typeof this.props.onError == "function") {
      this.props.onError(error.message, element)
    } else if (this.props.displayErrors === false) {
      console.warn("Unhandled Error, please provide an onError handler for your Form.", error)
    }
  }
  submit() {
    for (let i = 0; i < this.state.inputs.length; i++) {
      const input = this.state.inputs[i]
      const element = input.getElement()
      if (element.value === undefined) return this.onError('Input Value Undefined', element)
      const error = input.sanitize()
      if (error) return this.onError(error, element)
    }
    this.setState({errorDisplay: null})
    if (typeof this.props.onSubmit == "function") {
      const output = {}
      this.state.inputs.forEach(input => {
        const element = input.getElement()
        const { name, value } = element
        if (name) {
          output[name] = value
        } else {
          if (!output.hasOwnProperty("unknown")) output.unknown = []
          output.unknown.push(value)
        }
      })
      try {
        const submitOutput = this.props.onSubmit(output)
        if (submitOutput instanceof Promise) {
          if (this.props.catchSubmit !== false) submitOutput.catch(this.displayErrorFunction)
        }
      } catch(error) {
        if (this.props.catchSubmit !== false) this.displayErrorFunction(error)
      }
    } else {
      console.warn("Missing onSubmit Function!")
    }
  }
  static getDerivedStateFromProps(props) {
    const inputs = []
    const children = interpretChildren(props.children, input =>
      inputs.push(input)
    )
    const elementProps = {...props}

    allowedFormProps.forEach(prop => {
      if (elementProps.hasOwnProperty(prop)) delete elementProps[prop]
    })

    return {children, inputs, elementProps}
  }
  render() {
    const formProps = {...this.state.elementProps, onSubmit: e => {e.preventDefault(); this.submit()}}

    const childArgs = []

    if (this.props.hasOwnProperty("displayError") && this.props.displayError !== null) {
      if (typeof this.props.displayError != 'function') throw new Error("displayError must be a callback function or null")
      this.props.displayError(this.displayErrorFunction)
    }
    if (typeof this.state.errorDisplay == 'string') {
      childArgs.push(createElement("span", {className: "error"}, this.state.errorDisplay))
    }
    childArgs.push(this.state.children)

    return createElement("form", formProps, ...childArgs)
  }
}

module.exports = Form
