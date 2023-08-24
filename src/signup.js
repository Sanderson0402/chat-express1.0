import React from 'react';
import styles from './css.module.css'; // Importando os estilos

function signUp() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Chat Express</h2>
      <form className={styles.form}>
      <label htmlFor="username" className={styles.label}>Username</label>
        <input type="text" id="username" className={styles.input} />
        <label htmlFor="password" className={styles.label}>Password</label>
        <input type="password" id="password" className={styles.input} />
        <button className={styles.button}>Criar Conta</button>
      </form>
    </div>
  );
}

export default signUp;
