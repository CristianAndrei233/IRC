import React from "react";
import styled from "styled-components";

const rooms = [
    "general",
    "random",
   
   ];

function Chat(props){ 

    function renderRooms(){
       const currentChat = {
        chatName: rooms, 
        isChannel: true,
        recieverId: "",
       }
       return (
        <Row onClick={() => props.toggleChat(currentChat)} key={rooms}>
            {rooms}
        </Row>
       )
    }
let body;
if(props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
    body = (
        <Messages>
            {props.message.map(RenderMessages)}
        </Messages>
    )
    
}else{
    body = (
        <button onClick={() => props.joinRoom(props.currentChat.chatName)}>Join {props.currentChat.chatName}</button>
    )
}
function renderUser(user){
    if(user.id === props.yourId){
        return (
            <Row key={user.id}>
                You: {user.username}
            </Row>
        )
    }
    const currentChat = {
        chatName: user.username,
        isChannel: false,
        recieverId: user.id,
    }

    return (
        <Row onClick={() => props.toggleChat(currentChat)} key={user.id}>
            {user.username}
        </Row>
    )
}

function RenderMessages(message, index){
    return (
        <div key={index}>
            <h3>{message.sender}</h3>
            <p>{message.content}</p>
        </div>
    )
}
function handleKeyPress(e) {
    if(e.key === "Enter"){
        props.sendMessage();
    }	
}


    return(
        <Container>
            <SideBar>
                <h3>Channels</h3>
                {rooms.map(renderRooms)}
                <h3>All Users</h3>
                {props.allUsers.map(renderUser)}
            </SideBar>
            <ChatPanel>
                <ChannelInfo>
                    {props.currentChat.chatName}
                </ChannelInfo>
                <BodyContainer>
                    {body}
                </BodyContainer>
                <TextBox 
                value={props.message}
                onChange={props.handleMessageChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                />
            </ChatPanel>
        </Container>
    );
};

export default Chat;






const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const SideBar = styled.div`
    height: 100%;
    width: 15%;
    border-right: 1px solid black;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Row = styled.div`
    cursor: pointer;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

