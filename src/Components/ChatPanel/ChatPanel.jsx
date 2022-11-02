/*
import React, { useState } from "react";
import { Launcher } from "react-chat-window";
import "./ChatPanel.css";

const ChatPanel = (props) => {
  const [messageList, setMessageList] = useState([]);

  const HandleMessageSent = (message) => {
    setMessageList([...messageList, message]);
  };

  if (props.user) {
    return (
      <div>
        <Launcher
          agentProfile={{
            teamName: `${props.projectTitle} chat`,
          }}
          onMessageWasSent={HandleMessageSent}
          messageList={messageList}
        />
      </div>
    );
  }
};

export default ChatPanel;
*/