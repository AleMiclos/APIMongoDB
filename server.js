const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Configuração do MongoDB
mongoose.connect('mongodb+srv://alexandremiclos:alexandremiclos@scores.stzvf.mongodb.net/?retryWrites=true&w=majority&appName=scores', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Definindo o esquema do MongoDB para o jogo da nave espacial
const spaceshipScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const spaceshipScore = mongoose.model('SpaceshipScore', spaceshipScoreSchema);

// Definindo o esquema do MongoDB para o jogo do gênio
const geniusScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const geniusScore = mongoose.model('GeniusScore', geniusScoreSchema);

// Configurando o Express
const app = express();
app.use(express.json());
app.use(cors());

// Rota para salvar o placar do jogo da nave espacial
app.post('/save-score/spaceship', async (req, res) => {
    const { username, score } = req.body;

    if (!username || score === undefined) {
        return res.status(400).send('Por favor, forneça um nome de usuário e um placar');
    }

    const newScore = new spaceshipScore({ username, score });

    try {
        await newScore.save();
        res.status(201).send('Placar salvo com sucesso no jogo da nave espacial!');
    } catch (err) {
        res.status(500).send('Erro ao salvar o placar');
    }
});

// Rota para salvar o placar do jogo do gênio
app.post('/save-score/genius', async (req, res) => {
    const { username, score } = req.body;

    if (!username || score === undefined) {
        return res.status(400).send('Por favor, forneça um nome de usuário e um placar');
    }

    const newScore = new geniusScore({ username, score });

    try {
        await newScore.save();
        res.status(201).send('Placar salvo com sucesso no jogo do gênio!');
    } catch (err) {
        res.status(500).send('Erro ao salvar o placar');
    }
});

// Rota para listar todos os placares do jogo da nave espacial
app.get('/scores/spaceship', async (req, res) => {
    try {
        const scores = await spaceshipScore.find().sort({ score: -1 });
        res.status(200).json(scores);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar os placares do jogo da nave espacial' });
    }
});

// Rota para listar todos os placares do jogo do gênio
app.get('/scores/genius', async (req, res) => {
    try {
        const scores = await geniusScore.find().sort({ score: -1 });
        res.status(200).json(scores);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar os placares do jogo do gênio' });
    }
});

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
