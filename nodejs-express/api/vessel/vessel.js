// vessel.js
// this is the file holding the /api/vessel endpoints

const express = require(`express`)
const router = express.Router()
const tools = require(`../../tools/tools`)


// /api/vessel
// Lets use the middlewear from tools to validate the JWT token from Veracity Marketplace
//
router.get(`/`, tools.authorizeReq, (req, res) => {
    let payload = {}
    payload.message = `Hello World from api/vessel`
    payload.valueAdd = `some valuable data`
    res.json(payload)
})

router.get(`/imo`, tools.authorizeReq, (req, res) => {
    if (typeof req.headers.imo == `undefined`) res.sendStatus(400)
    if (req.headers.imo != 9797230) res.sendStatus(404)
    else { // demo with IMO: 9797230
        let payload = {}
        payload.imo = req.headers.imo
        payload.name = `FRONT CRUISER`
        payload.shipType = `Crude Oil Tanker`
        payload.flag = `Marshall Islands`
        payload.grosstonage = `84500`
        payload.summerDeadWeight = `158400`
        payload.yearBuilt = `2017`
        res.json(payload)
    }
})


module.exports = { router }


