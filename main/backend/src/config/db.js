// gestor-backend/src/config/db.js (COM NATIVE DRIVER)

const { MongoClient } = require('mongodb');

// URI é a string do seu .env
const uri = process.env.MONGO_URI; 

const client = new MongoClient(uri);

const connectDB = async () => {
    try {
        await client.connect();
        console.log(`📡 MongoDB Native Driver Conectado!`);
    } catch (error) {
        console.error(`❌ Erro de Conexão: ${error.message}`);
        process.exit(1);
    }
};

// Exportamos o cliente para que os Controllers possam acessar o DB
module.exports = { connectDB, client };