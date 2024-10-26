const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Configuração do MongoDB
mongoose.connect('mongodb://localhost:27017/gameScores', {
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
app.use(cors());

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

app.get('/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }); // Ordena por pontuação, do maior para o menor
        res.status(200).json(scores);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar os placares' });
    }
});

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
