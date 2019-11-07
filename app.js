const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const Mail = require('./Mail')
const db = require('./DataBase/db')
const express = require('express')
const app = express()

db()

setInterval(doNight, 5000)

function doNight() {
    nightmare
        .goto('https://temp-mail.org/fr/')
        .wait('#mail')
        .click('#click-to-delete')
        .evaluate(() => document.querySelector('#mail').value)
        .then(res => getMail(res))
        .catch(error => {
            console.error('Search failed:', error)
        })
        
}

function getMail(mail){
    const Regex = /\w+/g
    const name = mail.match(Regex)[0]
    const host = mail.match(Regex)[1]
    const extention = mail.match(Regex)[2]

    const myMail = new Mail({
        name: name,
        host: host,
        full: mail,
        extention: extention,
        date: new Date()
    })
    myMail.save()
    console.log('insert Done')
}

    app.get('/', (req,res) => {
        Mail.find().then(result => {
            res.send(JSON.stringify(result))
        })
    })

    app.listen(3090)