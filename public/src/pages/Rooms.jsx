import React, { useEffect, useState, useRef } from "react";
import  io  from "socket.io-client";
import styled from "styled-components";
import Form from "../components/UsernameForm";	
import Chat from "../components/Chat";
import immer from 'immer';

const initialMessagesState = {
  general : [],
  room : [],
  user : [],
}

export default function Rooms() {

  const [username, setUsername] = useState('');
  const [connected , setConnected] = useState(false);
  const [currentChat  , setCurrentChat] = useState({isChannel: true, chatName: "general" , recieverIed: "" });
  const [connectedRooms , setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState('');
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  useEffect(() => {
    setMessage('');	
  }, [messages])

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.recieverIed,
      sender: username, 
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,

    }

    socketRef.current.emit('sendMessage', payload);
    const newMessages = immer(messages, draft => {
      draft [currentChat.chatName].push({
        sender: username,
        content: message,
      });
    }
    );
    setMessages(newMessages);
  }

  function roomJoinCallback(incomingMessages, room) {
    const newMessages = immer(messages, draft => {
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function toggleChat(currentChat){
    if(!messages[currentChat.chatName]){
      const newMessages = immer(messages, draft => {
        draft[currentChat.chatName] = [];
      });

      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  function joinRoom(room){
    const newConnctedRooms = immer(connectedRooms, draft => {
      draft.push(room);
    });

    socketRef.current.emit('join room', room, (messages) => roomJoinCallback(messages, room));

    setConnectedRooms(newConnctedRooms);


  }

  function handleChange(e) {
    setUsername(e.target.value);
  }


  function connect() {
    setConnected(true);
    socketRef.current = io.connect("/");
    socketRef.current.emit('join server', username);
    socketRef.current.emit('join room', 'general', (messages) => roomJoinCallback(messages, 'general'));
    socketRef.current.on("new user", allUsers =>{
      setAllUsers(allUsers);
    })
    socketRef.current.on("new message", ({content, sender, chatName}) => {
      setMessages(messages => {
        const newMessages = immer(messages, draft => {
          if(draft[chatName]){
            draft[chatName].push({content, sender});

          }else{
            draft[chatName] = [{content, sender}];
          }
        })
        return newMessages;
      })
    })
  }

  let body;
  if(connected) {
    body = (
      <Chat
      message = {message}
      handleMessageChange= {handleMessageChange}
      sendMessage = {sendMessage}
      yourId = {socketRef.current ? socketRef.current.id : ""}
      allUsers = {allUsers}
      joinRoom = {joinRoom}
      connectedRooms = {connectedRooms}
      currentChat = {currentChat}
      toggleChat = {toggleChat}
      messages = {messages[currentChat.chatName]}
      />
    );
  }else{
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    );
  }

  return (
    <>
    <Container>
        <div className="app">
          {body}
        </div>
    </Container>
  </>
  )
}
const Container = styled.div`
	

`;
