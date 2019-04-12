//const axios = require('axios');
const Nightmare = require('nightmare')
const cheerio = require('cheerio');
const nightmare = Nightmare({ show: false })
const url = 'https://www.cinepolis.com.br/programacao/ribeirao+preto/30.html';
let $;
let movies = [];

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

        movies.forEach(movie => {
            console.log(movie);
        })
    })
    .catch(error => {
        console.log(error);
    });

