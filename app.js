const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const Mail = require('./Mail')
const db = require('./DataBase/db')
const express = require('express')
const app = express()
const axios = require('axios')

db()


function doNight_tempMail() {
    nightmare
        .goto('https://tempr.email/fr/')
        .click('#click-to-delete')
        .evaluate(() => document.querySelector('#mail').value)
        .then(res => getMail(res))
        .catch(error => {
            console.error('Search failed:', error)
        })
}

function doNight_dropmail() {
    nightmare
        .goto('https://dropmail.me/fr/')
        .evaluate(() => document.querySelector('.email').innerText)
        .then(res => (
            getMail(res)
            )
        )
        .catch(error => {
            console.error('Search failed:', error)
        })
        .refresh()
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
    axios.get('http://localhost:3090/cleanfail')
}

app.get('/dropmail', (req,res) => {
    setInterval(doNight_dropmail, 5000)
    res.send('Lancement du script pour https://dropmail.me/fr/')

})

app.get('/temp-mail', (req,res) => {
    setInterval(doNight_tempMail, 5000)
    res.send('Lancement du script pour https://temp-mail.org/fr/')
})


    app.get('/', (req,res) => {
        Mail.find().then(result => {
            res.send(JSON.stringify(result))
        })
    })

    app.get('/group/:by', (req,res) => {
        Mail.aggregate([
            { "$group": { _id: { host: `$${req.params.by}` }, count: { $sum: 1 } } } 
        ]).then(result => {
            res.send(JSON.stringify(result))
        })
    })



    
app.get('/add', (req, res) => {
const temprEmailDatas = require('./Datas/tempr-email')
temprEmailDatas.map(list => {
    const myMail = new Mail(
        list
    )
    myMail.save()
})
    res.send('Ajout OK')
})

app.get('/cleanFail', (req, res) => {
    Mail.remove({extention: null}).then(result => {
        res.send(JSON.stringify(result))
    })
})

    app.listen(3090)