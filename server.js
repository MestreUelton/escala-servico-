require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do Nodemailer para Hotmail/Outlook
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor de Escalas Online!');
});

// Rota para enviar e-mail
app.post('/enviar-email', async (req, res) => {
    try {
        const { nome, graduacao, rg, mes, ano, diasSelecionados, destinatario } = req.body;

        const mailOptions = {
            from: `"Sistema de Escalas" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: `Nova Escala de Serviço - ${nome}`,
            html: `
                <h1 style="color: #007bff;">Escala de Serviço</h1>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Graduação:</strong> ${graduacao}</p>
                <p><strong>RG:</strong> ${rg}</p>
                <p><strong>Período:</strong> ${mes}/${ano}</p>
                <p><strong>Dias Selecionados:</strong> ${diasSelecionados.join(', ')}</p>
                <hr>
                <p style="color: #6c757d;">Este e-mail foi gerado automaticamente pelo sistema de escalas.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ success: false, message: 'Erro ao enviar e-mail: ' + error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});