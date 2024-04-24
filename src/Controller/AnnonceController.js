const { Annonce } = require('../Model/Annonce')
const client = require('../Services/DbConnexion')
const { ObjectId } = require('bson')
const { extractToken } = require('../Utils/extractToken')
const jwt = require('jsonwebtoken')
const { json } = require('express')
require('dotenv').config()

const createAnnonce = async (request, response) => {
    if (
        !request.body.title ||
        !request.body.description ||
        !request.body.image ||
        !request.body.category ||
        !request.body.userId
    ) {
        response.status(400).json({ error: 'Some fields are missing' })
        return
    }

    const token = await extractToken(request);
     
       jwt.verify(token, process.env.MY_SUPER_SECRET_KEY, async (err, authData) => {
        if (err) {
            console.log("test1")
            response.status(401).json({ error: 'Unauthorized' })
            return
        } else {
           
            if (
                !request.body.title ||
                !request.body.description ||
                !request.body.image
            ) {
                
                response.status(400).json({ error: 'Some fields are missing' })
                return
            }
        
                    request.body.userId = authData.id
                
}})

            

    try {
        let annonce = new Annonce(
            request.body.title,
            request.body.description,
            request.body.image,
            request.body.category,
            request.body.userId,
            new Date(),
            'published'
        )

        let result = await client
            .db('courrir')
            .collection('annonce')
            .insertOne(annonce)
        response.status(200).json(result)
    } catch (e) {
        console.log(e)
        response.status(500).json(e)
    }
}

const getMyAnnonces = async (req, res) => {
    const token = await extractToken(req)
    console.log("mytocken",token);

    jwt.verify(
        token,
        process.env.MY_SUPER_SECRET_KEY,
        async (err, authData) => { console.log({err:err})
            console.log({authData: authData});
            if (err) {
        
                res.status(401).json({ err: 'Unauthorized' })
                return
            } else {
                let annonces = await client
                    .db('courrir')
                    .collection('annonce')
                    .find({ userId: authData.id })
                let apiResponse = await annonces.toArray()

                res.status(200).json(apiResponse)
            }
        }
    )
}

const getAllAnnonces = async (request, response) => {
    let annonces = await client
    .db('courrir')
    .collection('annonce')
    .find()
    .sort({ createdAt: -1 })

    let apiResponse = await annonces.toArray()
    response.status(200).json(apiResponse)
}

const deleteAnnonce = async (request, response) => {
    try {
        const token = await extractToken(request);
        
        jwt.verify(token, process.env.MY_SUPER_SECRET_KEY, async (err, authData) => {
            if (err) {
                response.status(401).json({ error: 'Unauthorized' });
                return;
            } else {
                if (!request.body.annonceId) {
                    response.status(400).json({ error: 'Annonce ID is missing' });
                    return;
                }

                const annonceId = new ObjectId(request.body.annonceId);

                const annonce = await client
                    .db('courrir')
                    .collection('annonce')
                    .findOne({ _id: annonceId });

                if (!annonce) {
                    response.status(404).json({ error: 'Annonce not found' });
                    return;
                }

                if (annonce.userId !== authData.id) {
                    response.status(401).json({ error: 'Unauthorized' });
                    return;
                }

                await client
                    .db('courrir')
                    .collection('annonce')
                    .deleteOne({ _id: annonceId });

                response.status(200).json({ message: 'Annonce deleted successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Error deleting the annonce' });
    }
};


const updateAnnonce = async (request, response) => {
    const token = await extractToken(request)
    
    jwt.verify(token, process.env.MY_SUPER_SECRET_KEY, async (err, authData) => {
        if (err) {
            
            response.status(401).json({ error: 'Unauthorized' })
            return
        } else {
            if (
                !request.body.title ||
                !request.body.description ||
                !request.body.image ||
                !request.body.annonceId
            ) {
                response.status(400).json({ error: 'Some fields are missing' })
                return
            }

            try {
                const annonceId = new ObjectId(request.body.annonceId)
                const annonce = await client
    
                    .db('courrir')
                    .collection('annonce')
                    .findOne({ _id: annonceId })
                    console.log(annonce)
                if (!annonce) {
                    response.status(401).json({ error: 'Unauthorized' })
                  
                    return
                }

                if (annonce.userId !== authData.id) {
                    console.log(annonce.userId, "test")
                    console.log(authData.id)
                    response.status(401).json({ error: 'Unauthorized' })
                    return
                }

                await client
                    .db('courrir')
                    .collection('annonce')
                    .updateOne(
                        { _id: request.body.annonceId },
                        {
                            $set: {
                                title: request.body.title,
                                description: request.body.description,
                                image: request.body.image,
                                category: request.body.category,
                                status: request.body.status,
                            },
                        }
                    )

                response.status(200).json({ message: 'Annonce mise à jour avec succès' })
            } catch (error) {
                console.error(error)
                response.status(500).json({ error: 'Erreur lors de la mise à jour de l\'annonce' })
            }
        }
    })
}


module.exports = {
    createAnnonce,
    getAllAnnonces,
    getMyAnnonces, 
    updateAnnonce,
    deleteAnnonce,
}
