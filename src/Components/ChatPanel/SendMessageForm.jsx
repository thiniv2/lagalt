import { useState } from "react"
import { Form, FormControl, InputGroup, Button } from "react-bootstrap"

const SendMessageForm = ({sendMessage}) => {

  const [message, setMessage] = useState('')




  return (
  <Form onSubmit={e => {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
  }}>
    <InputGroup>
      <FormControl placehoder="message..." onChange={e => setMessage(e.target.value)} value={message} aria-describedby="basic-addon2"/>
      
        <Button variant='primary' type='submit' disabled={!message} id="basic-addon2">
          Send
        </Button>
      
    </InputGroup>
  </Form>
  )
}

export default SendMessageForm