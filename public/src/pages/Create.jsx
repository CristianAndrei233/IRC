import React from 'react'
import Background from "../assets/background.mp4";
import Logo from "../assets/logo.svg";
import styled from "styled-components";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";


export default function Create() {
    const socket = io.connect('http://localhost:5000');

    const [createRoom, setCreateRoom] = useState('')

    
    
    const handleChange = (event) => {
        setCreateRoom(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit("create_room", createRoom)
    }

    return (
        <>
          <FormContainer>
          <div className="background">
           <video src={Background} loop autoPlay />
         </div>
            <form >
              <div className="brand">
                <img src={Logo} alt="logo" />
                <h1>Coco Chat</h1>
              </div>
              <input
                type="text"
                placeholder="Join room"
                name="username"
                onChange={handleChange}

              />

              <button type="submit" onClick={handleSubmit} >Join</button>

            </form>
          </FormContainer>
        </>
      );
    }
    
    const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background: rgb(0, 0, 0, 0.7);
    .background {
    position: absolute;
    width: 100%;
    z-index: -1;
    }
    
      .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
          height: 5rem;
        }
        h1 {
          color: white;
          text-transform: uppercase;
        }
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 2rem;
        padding: 3rem 5rem;
        box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
        input {
          background-color: transparent;
          border: 0.1rem solid white;
          padding: 1rem;
          border-radius: 0.5rem;
          color: white;
          width: 100%;
          font-size: 1rem;
          &:focus {
            outline: none;
            border: 0.1rem solid #e9e416;
          }
        }
        button {
          background-color: rgba(0, 146, 118, 0.2);
          color: white;
          border: none;
          border-radius: 0.4rem;
          padding: 1rem 2rem;
          font-weight: bold;
          cursor: pointer;
          font-size: 1rem;
          text-transform: uppercase;
          &:hover {
            background-color: rgba(203, 65, 11, 0.4);
            transition: all 0.5s ease-in-out;
          }
        }
        span {
          color: white;
          a {
            color: #e9e416;
            text-decoration: none;
            font-weight: bold;
          }
        }
      }
    `;
