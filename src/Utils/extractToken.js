const jwt = require('jsonwebtoken')
const client = require('../Services/DbConnexion')

async function extractToken(req) {
    // Je passe ma requête entrante à cette fonction
    // Je récupère l'authorization se trouvant dans le header de ma requête
    //
    const headerWithToken = req.headers.authorization
    // Si le token n'est pas undefined
    if (typeof headerWithToken !== undefined || !headerWithToken) {
        // Je split ma chaine de caractère en deux, la séparation
        // se faisant à chaque espace, autrement dis tous les mots
        // séparés par des espaces seront des indexs du tableau
        const bearer = headerWithToken.split(' ')

        // Cette chaîne de caractère étant écrite comme ceci :
        //            Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMDE3MjljZS1hZDY1LTQ2OTItYTExYy1iYTUzNWU1ODBjNWMiLCJlbWFpbCI6Imt0cjJAc3QuY29tIiwiZ2RwciI6IjIwMjQtMDItMThUMjE6NDk6MzguMzM1WiIsImlhdCI6MTcxMjMxOTAxNywiZXhwIjoxNzE0OTExMDE3fQ._7PQEfX1NawBQ_iS9ywnFa427VkemLaXUy15GxWYDqU
        // L'index [0] du tableau sera le mot bearer (et on l'utilise pas)
        // Le deuxième index sera le jwt
        const token = bearer[1]
        return token
    }
}

async function verifyToken(token, key, res, db, collection, field) {
    jwt.verify(token, key, async (err, authData) => {
        if (err) {
            res.status(401).json({ err: `Unauthorized - ${err}` })
            console.log('erreur ')
            return
        } else {
            try {
                console.log(authData)
                let listings = await client
                    .db(db)
                    .collection(collection)
                    .find({ userId: authData.id })
                let apiResponse = await listings.toArray()

                res.status(200).json(apiResponse)
            } catch (e) {
                res.status(500).json({ err: 'err' })
            }
        }
    })
}

module.exports = { extractToken, verifyToken }
