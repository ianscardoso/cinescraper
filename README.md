# Cinescraper
A web scraper to get information about movies playing on my favorite movie theater and send to me via e-mail.

# How I use it
It's a little lazy, but I set a task with Windows Task Scheduler to run the index.js file with Node every saturday morning, wich is the day 
I usually go to the movies.

Ideally, the script would run every thursday and get information about saturday movies, but I'm still learning how to use Nightmare 
and other modules, so that will have to come later (maybe).

# How I make it work
- Install dependencies
- Set up a config.js file that looks like this:

       ```
        module.exports = {
            emailUser: 'replace with sender email',
            emailPassword: 'replace with sender password',
            recipient: 'replace with recipient email'
        }
        ```
        
- Set up a task with Windows Task Scheduler that runs node.exe and make it run the index.js file

# Built with
- [cheerio](https://github.com/cheeriojs/cheerio)
- [nightmare](https://github.com/segmentio/nightmare)
- [node](https://nodejs.org/en/)
- [nodemailer](https://github.com/nodemailer/nodemailer)

> I did nothing, basically
