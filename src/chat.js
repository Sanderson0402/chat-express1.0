import React, { useState, useEffect } from 'react';
import styles from './css.module.css'; 
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const socket = io('http://localhost:5000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [nickname, setNickname] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Ouvir mensagens antigas
    socket.on('previousMessages', (messages) => {
      console.log('Received messages from server:', messages);
      setMessages(messages);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const nicknameParam = urlParams.get('nickname');
    setNickname(nicknameParam);

    // Ouvir novas mensagens
    socket.on('receivedMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [location.search]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (messageInput.trim() !== '') {
      const author = nickname;
      const message = messageInput;

      // Emitir mensagem para o servidor
      socket.emit('sendMessage', { author, message });

      setMessageInput('');
    }
  };

  // Estilo inline para o elemento body
  const bodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'rgb(8, 8, 8)',
  };

  return (
    <div style={bodyStyle}>
      <h2 className={styles.heading}>Chat Express</h2>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <><div key={index}>
            <strong>{msg.author}: </strong> {msg.message}
          </div><br /></>
        ))}
        {messages.length === 0 && <div>Nenhuma mensagem disponível.</div>}
      </div>
      <form onSubmit={sendMessage}>
        <input className={styles.chatInput}
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Digite sua mensagem"
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;
