import { Button, Form } from "react-bootstrap"
import { useState } from "react"
import { useUser } from "../../Context/UserContext"

const Lobby = ({joinRoom, project}) => {
  const {user} = useUser()



  return (
  <Form onSubmit={e => {
    e.preventDefault()
    joinRoom(user.name, project.title + ' -project chat')
  }}>

    <Button variant='success' type="submit" disabled={!user || !project}>{user ? 'Join chat' : 'Login to chat'}</Button>
  </Form>
  
  )
}

export default Lobby