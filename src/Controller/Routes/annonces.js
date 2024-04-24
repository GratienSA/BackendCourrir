const express = require('express')
const {
    createAnnonce,
    getAllAnnonces,
    getMyAnnonces,
    updateAnnonce,
    deleteAnnonce,
} = require('../AnnonceController')
const { verifyToken } = require('../../Utils/extractToken')

const router = express.Router()

router.route('/create').post(createAnnonce)

router.route('/all').get(getAllAnnonces)

router.route('/mine').post( getMyAnnonces)

router.route('/update').patch(updateAnnonce)

router.route('/delete').delete(deleteAnnonce)

module.exports = router
