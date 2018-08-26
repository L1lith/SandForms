const { Component, createElement } = require("react")
const interpretChildren = require("./functions/interpretChildren")
const React = require("react")

class Form extends Component {
  constructor(props) {
    super(props)
  }
  onError(error, data) {
    if (typeof this.props.onError == "function") {
      this.props.onError(error.message, data)
    }
  }
  submit() {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i]
      const error = input.sanitize()
      if (error)
        return this.onError(error, {
          input: input.input,
          value: input.input.value
        })
    }
    if (typeof this.props.onSubmit == "function") {
      const output = {}
      this.inputs.forEach(input => {
        const { name } = input.input
        if (name) {
          output[name] = input.input.value
        } else {
          if (!output.hasOwnProperty("unknown")) output.unknown = []
          output.unknown.push(input.input.value)
        }
      })
      this.props.onSubmit(output)
    }
  }
  render() {
    this.inputs = []
    const children = interpretChildren(this.props.children, input =>
      this.inputs.push(input)
    )
    return createElement("form", {onSubmit: e => {e.preventDefault(); this.submit()}}, children)
  }
}

module.exports = Form
