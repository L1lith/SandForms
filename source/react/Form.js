const {Component} = require('react')
const interpretChildren = require('./functions/interpretChildren')

class Form extends Component {
  constructor(props) {
    super(props)
    //Object.assign(this, interpretChildren(this.props.children) || {})
  }
  render() {
    return this.children
  }
}

module.exports = Form
