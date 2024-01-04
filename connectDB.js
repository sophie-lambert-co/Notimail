import mysql from 'mysql2/promise';

let connection; // Variable globale pour stocker la connexion

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: '172.17.0.2',
      port: 3306, // Port MySQL
      user: 'root',
      password: 'root',
      database: 'NOTIMAIL'
    });

    console.log('Connecté à NOTIMAIL');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à MySQL :', error);
    throw error;
  }
};

export { connectDB, connection }; // Exportez la connexion et la fonction connectDB

