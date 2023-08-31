import React, { useState } from 'react';
import styles from './css.module.css'; // Importando os estilos
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });


      if (response.ok) {
        const data = await response.json();
        console.log(data.nickname.nickname);
        window.location.href = `/chat?nickname=${encodeURIComponent(data.nickname.nickname)}`;
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Chat Express</h2>
      <form className={styles.form} onSubmit={handleLogin}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          type="text"
          id="username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button}>Login</button>
        <label htmlFor="signup" className={`${styles.label} ${styles.signUp}`}>
          <Link to="/signup"style={{ textDecoration: 'none', color: 'inherit'}}>Não tem conta?</Link>
        </label>
      </form>
    </div>
  );
}  

export default Login;