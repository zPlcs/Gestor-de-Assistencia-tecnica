// gestor-backend/src/utils/dataSeeder.js

const Funcionario = require('../models/Funcionario');
// O Mongoose já está conectado e Funcionario já deve estar importado no server.js

// Define as credenciais mestras fixas
const CREDENCIAIS_MESTRE = {
    email: 'desenvolvedor@gestor.com',
    senha: '123456',
    nome: 'Desenvolvedor Mestre',
    cargo: 'Desenvolvedor', // Acesso Total ao sistema
    status: 'Ativo'
};

const seedDeveloperUser = async () => {
    try {
        // 1. Verifica se o usuário mestre já existe pelo e-mail
        const userExists = await Funcionario.findOne({ email: CREDENCIAIS_MESTRE.email });

        if (userExists) {
            console.log('✅ Usuário Desenvolvedor Mestre já existe. Ignorando seed.');
            return;
        }

        // 2. Cria o novo usuário
        // A senha será criptografada automaticamente pelo middleware 'pre('save')' no Model Funcionario.js!
        await Funcionario.create(CREDENCIAIS_MESTRE);

        console.log('--- SEED SUCESSO ---');
        console.log(`🔑 Usuário Mestre criado! Login: ${CREDENCIAIS_MESTRE.email} | Senha: ${CREDENCIAIS_MESTRE.senha}`);
        console.log('--------------------');

    } catch (error) {
        console.error('❌ Falha ao criar usuário mestre (Seed): Verifique o Model Funcionario.js.', error.message);
    }
};

module.exports = { seedDeveloperUser };