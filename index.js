const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const config = require('./config.js');

const nightmare = Nightmare({ show: false });

function scrap() {
    // 30 = Cinépolis Iguatemi Ribeirão Preto              
    const url = 'https://www.cinepolis.com.br/programacao/ribeirao+preto/30.html'; // /city/movie_theater_id

    nightmare
        .goto(url)
        .wait('#programacao_cinepolis')
        .evaluate(() => document.querySelector('#programacao_cinepolis').innerHTML)
        .end()
        .then(response => {
            let $;
            let movies = [];

            $ = cheerio.load(response);

            // each movie in theater on that date
            $('.tituloPelicula').each((i, movie) => {
                let sessions = [];

                // each type of session the movie has, e.g. "3D LEG", "DUB" etc
                $(movie).find($('.horarioExp')).each((i, session) => {

                    // get the times in wich the movie is playing on a type of session
                    let times = [];
                    $('time', session).each((i, time) => {
                        times.push($(time).attr('alt'));
                    })

                    sessions.push({
                        // get the type of session
                        type: $(session).find($('span', 'p')).text().trim(),
                        times: times
                    })
                })

                movies.push({
                    title: $(movie).find('.datalayer-movie').text(),
                    duration: $(movie).find('.duracion').text(),
                    sessions: sessions
                })
            })

            sendMail(movies);
        })
        .catch(error => {
            console.log(error);
        });
}

function sendMail(movies) {
    let text = getText(movies);

    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: `${config.emailUser}`,
            pass: `${config.emailPassword}`
        }
    });

    let mailOptions = {
        from: `${config.emailUser}`,
        to: config.recipient,
        subject: 'Movies in Theater',
        text: `${text}`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            console.log(error);
        else
            console.log('Email sent: ' + info.response);
    })
}

function getText(movieList) {
    let text = 'Movies playing at Cinépolis Iguatemi:\n\n';

    movieList.forEach(movie => {
        text += `\nTitle: ${movie.title}
        Duration: ${movie.duration}
        Sessions:\n`;

        movie.sessions.forEach(session => {
            let type = session.type.replace(/\n| +/g, ' ');

            text +=
            `Type: ${type}
             Times: ${session.times}\n`;
        })
    });

    return text;
}

scrap();