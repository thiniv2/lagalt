const MessageContainer = ({messages}) => {
  return (
    <div>
      {messages.map((message, index) => {
        return (
          <div key={index} className='user-message'>
            <div className='message bg-primary'> {message.message} </div>
            <div className='from-user'> {message.user}</div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageContainer