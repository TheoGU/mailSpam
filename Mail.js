const mongoose = require('mongoose')


const mailSchema = mongoose.Schema({
    full: String,
    name: String,
    host: String,
    extention: String,
    date: Date
})


const Mail = mongoose.model('Mail', mailSchema)


module.exports = Mail