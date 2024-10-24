const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Configuração do MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Definindo o esquema do MongoDB
const scoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Configurando o Express
const app = express();
app.use(express.json());

// Configuração do CORS para permitir seu frontend
app.use(cors({
  origin: 'https://tabela-react-js.vercel.app'  // Substitua pela URL do seu front-end no Vercel
}));

// Rota para salvar o placar
app.post('/save-score', async (req, res) => {
    const { username, score } = req.body;

    if (!username || !score) {
        return res.status(400).send('Por favor, forneça um nome de usuário e um placar');
    }

    const newScore = new Score({ username, score });

    try {
        await newScore.save();
        res.status(201).send('Placar salvo com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao salvar o placar');
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para listar todos os placares
app.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }); // Ordenar por pontuação, do maior para o menor
        res.status(200).json(scores);
    } catch (err) {
        res.status(500).send('Erro ao buscar os placares');
    }
});

// Rota para listar os 10 melhores placares
app.get('/top-scores', async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1 }).limit(10); // Top 10
        res.status(200).json(topScores);
    } catch (err) {
        res.status(500).send('Erro ao buscar os melhores placares');
    }
});
