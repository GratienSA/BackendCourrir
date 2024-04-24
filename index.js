const express = require('express')
const app = express()
const cors = require('cors')
const { connect } = require('../BackendCourrir/src/Services/DbConnexion')
const userRoutes = require('./src/Controller/Routes/users')
const annonceRoutes = require('./src/Controller/Routes/annonces')


app.use(express.json())
app.use(cors())

connect("mongodb://127.0.0.1:27017/", (error) => {
    if (error) {
        console.log('Failed to connect')
        process.exit(-1)
    } else {
        console.log('successfully connected')
    }
})

app.use('/user', userRoutes)
app.use('/annonce', annonceRoutes)

app.listen(5000, function () {
    console.log('Serveur en écoute sur le port 5000 ');
});

