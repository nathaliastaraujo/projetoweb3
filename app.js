// Carregando modulos
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var http = require('http');
const path = require("path");
const db = require("./config/db");

// Configs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Mongoose
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI).then(() => {
    console.log("MongoDB conectado - projetoweb2 criado")
}).catch((err) => {
    console.log("Erro ao conectar: " + err)
})

// Outros
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})

// Rotas
require("./models/Postagem")
const Postagem = mongoose.model('postagens')

/* app.get('/', (req, res) => {
    Postagem.find().then((postagens) => {
        res.render('home', { postagens: postagens })
    }).catch((err) => {
        console.log("ERRO AO CARREGAR TWEETS")
        res.redirect('index')
    })
}) */

app.get('/', (req, res) => {
    Postagem.find().then((postagens) => {
        res.render('home', { postagens: postagens })
    }).catch((err) => {
        console.log("ERRO AO CARREGAR TWEETS")
        res.redirect('home')
    })
})


app.post('/pesquisa', (req, res) => {
    var query = req.body.pesq;
    Postagem.find({ texto: query }).then((postagens) => {
        res.render('resultado', { postagens: postagens })
    }).catch((err) => {
        console.log("ERRO AO CARREGAR TWEETS")
        res.redirect('posts')
    })
})


// Projeto 03
app.get('/tl', (req, res) => {
    Postagem.find().then(
        (postagens) => {
            res.end(postagens.map((postagem) => {
                return '<div class="container">' + postagem.texto + '</div> <br> <br>'}).join(""));
        });
})

app.post('/postar', (req, res) => {
    const novaPostagem = {
        texto: req.body.texto.trim(),
        imagem: req.file
    }

    new Postagem(novaPostagem).save().then(function () {
        res.redirect('/')
        console.log("Postagem realizada com sucesso!")
        Postagem.find().then(
            (postagens) => {
                res.end(postagens.map((postagem) => {
                    return '<div class="container">' + postagem.texto + '</div><br>'
                }).join(""));
            });
    }).catch((err) => {
        console.log("Erro ao postar.")
    })
})

app.post('/live-src', (req, res) => {
    var query = req.body.pesq;
    Postagem.find({ texto: query }).then((postagens) => {
        res.end(postagens.map((postagem) => {
            return '<div class="container">' + postagem.texto + '</div> <br> <br>'
        }).join(""));
    });
})

app.get('/jsonmsg', (req, res) => {
    res.setHeader('Content-Type', 'package.json');
    res.end(JSON.stringify('Projeto Web 03 - Nathalia e Hidemi'));
})

http.createServer(app).listen(8080);

