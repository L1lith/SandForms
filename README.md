# SandForms
SandForms makes working with forms a breeze! This library utilizes the powers of intelligent error handling and Sandhands great sanitization power.

#### Installation
```
npm i -s sandforms
```

#### Example Usage
```js
import {Form, Input} from 'sandforms'
import React from 'react'

class Login extends React.Component {
  render() {
    return (
      <Form onSubmit={submit} onError={this.error}>
      	<Input name="username" minLength={3} maxLength={25} regex={/^[a-zA_Z0-9]+$/}/>
        <Input name="password" type="password" minLength={8}/>
        <input type="submit"/>
      </Form>
    )
  }
}

function submit({username, password}) {
    	console.log(`Got username "${username}", and password "${password}".`)
    	/* Note: We can throw an error in this function or return a promise that throws an error and it will automatically display that error inside the form.
    	This can cause the unintended side effect that if there is a bug in our code the error message will be shown to the end user.
    	You can disable this behavior by setting the prop "catchSubmit" to false.
    	However, I suggest you leave it enabled as it gives you an easy way to do show errors to the end user once they submit the form*/
  }

export default Login
```

#### The Input Element
SandForms uses [Sandhands](https://github.com/L1lith/Sandhands) to provide advanced input validation. To read more about the validation options see the [strings format](https://l1lith.github.io/Sandhands/format) in the Sandhands documentation. Simply supply your sanitization parameters as props to the Input element.

#### The Form Element
The Form element is the base of every form. It has a number of different options available to you. You can supply them via the Form element's props.

##### onSubmit (function)
Provide a function to be called once the form has been validly submitted.
##### onError (function)
Provide a function to be called when the form has been invalidly submitted.
##### displayErrors
Flag as false to have Sandforms not output error messages to the end user inside the form.
##### catchSubmit
Flag as false to have Sandforms not output error messages from your onSubmit function to the end user.

### Compatability
Currently SandForms only supports react, however there are plans for vanilla JS support in the future.

## React Usage
SandForms provides a Form component that will automatically hook into any Input elements you create inside of it. When the form is submitted it will automatically validate each Input element and display any resulting errors. If there are no errors it will call your onSubmit function. You can catch the error yourself by providing an onError function.
