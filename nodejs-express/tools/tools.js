// tools.js
// This file holds functions you want to use accross you service
const express = require(`express`)
const jwt = require(`jsonwebtoken`)
const jwk2pem = require(`pem-jwk`).jwk2pem


const jwks = require(`../dummyJWKs.json`)

// These may need some updating
const signOptions = {
    issuer: `https://api.veracity.com`,
    algorithms: `RS256`
    // add additional sign options if you want
}

// Middlewear that will check if the request is authorized
function authorizeReq(req, res, next) {
    // First we grab the token from the header
    const bearerTokenHead = req.headers['authorization']
    // We then check that the token exist, or return 403 
    if (typeof bearerTokenHead == `undefined`) res.sendStatus(403) // there is no token
    // Then we split the "bearer" and the JWT part
    const bearerToken = bearerTokenHead.split(` `)
    // We grab only the secon part, that is the JWT that we need
    const token = bearerToken[1]
    //we select the correct key from the JWKs
    const publicPem = pemfromkid(token)
    // Now we have the token and correct JWK
    jwt.verify(token, publicPem, signOptions, (err, payload) => {
        //we now check that there is nothing wrong with the token
        if (err) res.sendStatus(401) // token is not valid
        if ( typeof payload == `undefined`) res.sendStatus(401)
        // You can do additional checks here. See the EITF RFC 7517 and RFC 7519
        if (payload.iss != `https://api.veracity.com`) res.sendStatus(401) // token not issued by me
        // We now know that the request is valid. Lets return with the payload
        res.payload = payload
        next()
    })
}

function pemfromkid (token) {
    // decode the token ignoring signature to find correct key to use
    const decoded = jwt.decode(token, {complete: true})
    for(var i = 0; i < jwks.keys.length; i++) {
        if(jwks.keys[i].kid === decoded.header.kid){
            return jwk2pem(jwks.keys[i])
        } 
    }
}





module.exports = { authorizeReq }