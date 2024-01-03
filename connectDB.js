import mysql from 'mysql2/promise';

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: '172.17.0.2',
      user: 'root',
      password: 'root',
      database: 'NOTIMAIL'
    });

    console.log('Connecté à NOTIMAIL');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à MySQL :', error);
    throw error; // Permet de propager l'erreur à l'appelant
  }
};

export default connectDB;
