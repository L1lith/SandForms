const { Component, createElement } = require("react")
const interpretChildren = require("./functions/interpretChildren")
const React = require("react")
const autoBind = require("auto-bind")

class Form extends Component {
  constructor(props) {
    super(props)
    autoBind(this)
  }
  onError(error, element) {
    if (typeof this.props.onError == "function") {
      this.props.onError(error.message, element)
    }
  }
  submit() {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i]
      const element = input.getElement()
      if (element.value === undefined) return this.onError('Input Value Undefined', element)
      const error = input.sanitize()
      if (error) return this.onError(error, element)
    }
    if (typeof this.props.onSubmit == "function") {
      const output = {}
      this.inputs.forEach(input => {
        const element = input.getElement()
        const { name, value } = element
        if (name) {
          output[name] = value
        } else {
          if (!output.hasOwnProperty("unknown")) output.unknown = []
          output.unknown.push(value)
        }
      })
      this.props.onSubmit(output)
    }
  }
  static getDerivedStateFromProps(props) {
    const inputs = []
    const children = interpretChildren(props.children, input =>
      inputs.push(input)
    )
    const elementProps = {...props}
    delete elementProps.onSubmit
    delete elementProps.onError
    return {children, inputs, elementProps}
  }
  render() {
    return createElement("form", {...this.state.elementProps, onSubmit: e => {e.preventDefault(); this.submit()}}, this.state.children)
  }
}

module.exports = Form
