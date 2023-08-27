import React, { useState } from 'react';
import styles from './css.module.css'; 

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });


      if (response.ok) {
        window.location.href = 'http://localhost:3000/';
      } else {
        console.error('Sign up failed');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Chat Express</h2>
      <form className={styles.form} onSubmit={handleSignUp}>
        <label htmlFor="username" className={styles.label}>Username</label>
        <input
          type="text"
          id="username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Atualiza o estado do username
        />
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Atualiza o estado do password
        />
        <button type="submit" className={styles.button}>Criar Conta</button>
      </form>
    </div>
  );
}

export default SignUp;
