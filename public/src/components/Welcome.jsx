import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Hello from "../assets/hello.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
      <img src={Hello} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat or a room to Start messaging. Or even create a new room yourself !</h3>
    </Container>
  );
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
gap: 1rem;
img {
  height: 10rem;
  span { color: #ffc107; }
}
`;
