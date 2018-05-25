const mongoose = require('mongoose')

let csv = mongoose.model('csv', {})
csv.db = mongoose.connection.db;
csv.collection = 'csv'


csv.find((err, docs) => {
    if(err) console.log(err.message)
    else console.log(docs)
})

module.exports = csv;