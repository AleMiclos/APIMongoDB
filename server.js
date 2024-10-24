require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicialize o aplicativo Express
const app = express();

// Middleware para permitir requisições JSON
app.use(express.json()); // Deve ser definido antes de suas rotas

// Conectar ao MongoDB
const uri = process.env.MONGODB_URI;

console.log('MONGODB_URI:', uri); // Verifica se a variável está correta

if (!uri) {
    console.error('Erro: A variável de ambiente MONGODB_URI não está definida.');
    process.exit(1);
}

// Conectar ao MongoDB sem as opções depreciadas
mongoose.connect(uri)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definindo o esquema do MongoDB
const scoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Configuração do CORS para permitir seu frontend
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'https://tabela-react-js.vercel.app'  // Substitua pela URL do seu front-end no Vercel
}));

// Rota para salvar o placar
app.post('/save-score', async (req, res) => {
    console.log('Dados recebidos:', req.body); // Use req.body em vez de response

    const { username, score } = req.body;

    if (!username || score === undefined) {
        return res.status(400).send('Por favor, forneça um nome de usuário e um placar');
    }

    const newScore = new Score({ username, score });

    try {
        await newScore.save();
        res.status(201).send('Placar salvo com sucesso!');
    } catch (err) {
        console.error('Erro ao salvar o placar:', err);
        res.status(500).send('Erro ao salvar o placar');
    }
});

// Rota para listar todos os placares
app.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find({}, { field: 0 }) // Projeção
            .collation({ locale: 'en', strength: 2 }) // Collation
            .sort({ field: -1 }); // Ordenação
        res.status(200).json(scores);
    } catch (err) {
        console.error('Erro ao buscar os placares:', err);
        res.status(500).json({ error: 'Erro ao buscar os placares' });
    }
});

// Rota para listar os 10 melhores placares
app.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find({}, { field: 0 }) // Projeção
            .collation({ locale: 'en', strength: 2 }) // Collation
            .sort({ field: -1 }); // Ordenação
        res.status(200).json(scores);
    } catch (err) {
        console.error('Erro ao buscar os placares:', err);
        res.status(500).json({ error: 'Erro ao buscar os placares' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
