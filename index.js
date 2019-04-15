// node_modules
const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const config = require('./config.js');

const nightmare = Nightmare({ show: false });
const url = 'https://www.cinepolis.com.br/programacao/ribeirao+preto/30.html';
let $;
let movies = [];

function scrap() {
    nightmare
        .goto(url)
        .wait('#programacao_cinepolis')
        .evaluate(() => document.querySelector('#programacao_cinepolis').innerHTML)
        .end()
        .then(response => {
            $ = cheerio.load(response);
            $('.tituloPelicula').each((i, movie) => {
                let sessions = [];
                $(movie).find($('time', '.horarioExp')).each((i, time) => {
                    sessions.push($(time).attr('alt'));
                })

                movies.push({
                    title: $(movie).find('.datalayer-movie').text(),
                    duration: $(movie).find('.duracion').text(),
                    sessions: sessions
                })
            })

            text(movies);

            return true;
        })
        .catch(error => {
            console.log(error);

            return false;
        });
}

function sendMail(text) {
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: `${config.emailUser}`,
            pass: `${config.emailPassword}` 
        }
    });

    let mailOptions = {
        from: `${config.emailUser}`,
        to: 'ianscardoso@hotmail.com',
        subject: 'Filmes de hoje',
        text: `${text}`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            console.log(error);
        else
            console.log('Email sent: ' + info.response);
    })
}

function text(movieList) {
    let text = 'Filmes no Cinépolis:\n\n';

    movieList.forEach(movie => {
        text += `\nTítulo: ${movie.title}
        Duração: ${movie.duration}
        Horários: ${movie.sessions}\n`
    });

    sendMail(text);
}

scrap();