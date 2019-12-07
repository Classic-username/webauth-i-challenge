const express = require('express')
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)
const helmet = require('helmet')
const cors = require('cors')

const authRouter = require('../auth/auth-router.js')
const usersRouter = require('../users/users-router.js')

const server = express()

const sessionConfig = {
    name: 'monkey',
    secret: 'keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000 * 30 * 60,
        secure: false,//only false in development, in production/environment it will be true
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore({
        knex: require('../database/dbConfig'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 30 * 60
    })
}

server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session(sessionConfig))

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)

server.get('/', (req, res) => {
    res.json({api:'up'})
})

module.exports = server