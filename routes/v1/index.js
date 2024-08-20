const express = require('express')
const expressJwt = require('express-jwt')

const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] }) // the JWT auth check middleware

const login = require('./Auth')
const signup = require('./Auth/signup')
const forgotpassword = require('./Auth/password')

const router = express.Router()

router.post('/login', login.post) // UNAUTHENTICATED
router.post('/signup', signup.post) // UNAUTHENTICATED
router.post('/forgotpassword', forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post('/resetpassword', forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX

router.all('*', checkJwt)

module.exports = router
