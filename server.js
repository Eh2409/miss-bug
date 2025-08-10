import path from 'path'
import express from 'express'
import cookieParse from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { generatePdf } from './services/pdf.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

const app = express()

app.set('query parser', 'extended')

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParse())


app.get('/api/bug', (req, res) => {

    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || [],
        sortType: req.query.sortType || 'new',
        dir: +req.query.dir || -1,
        pageIdx: req.query.pageIdx !== 'undefined' ? req.query.pageIdx : undefined,
        creatorId: req.query.creatorId || ''
    }

    bugService.query(filterBy)
        .then(data => res.send(data))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug/pdf', (req, res) => {

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=bugs.pdf',
    })

    generatePdf(
        (chunk) => res.write(chunk),
        () => res.end()
    )
        .catch(err => {
            if (!res.headersSent) {
                loggerService.error(err)
                res.status(400).send(err)
            } else {
                res.end()
            }
        })
})

app.post('/api/bug', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    const bug = req.body

    if (!loggedinUser) {
        return res.status(400).send('Not authorized to add bug')
    }

    const { title, description, severity, labels } = bug


    if (!title || !description || !severity) {
        return res.status(400).send('Required fields are missing')
    }

    const bugToSave = {
        title,
        description,
        severity: +severity,
        labels,
        creator: { _id: loggedinUser._id, username: loggedinUser.username }
    }

    bugService.add(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    const { body: bug } = req

    const { _id, title, description, severity, createdAt, labels, creator } = bug

    if (!_id || !title || !description || !severity || !creator || !createdAt) {
        return res.status(400).send('Required fields are missing')
    }

    if (!loggedinUser || loggedinUser._id !== creator._id && !loggedinUser.isAdmin) {
        return res.status(400).send('Not authorized to update bug')
    }


    const bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        createdAt: +createdAt,
        labels,
        creator
    }

    bugService.update(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    const { bugId } = req.params

    if (!loggedinUser) {
        return res.status(400).send('Not authorized to remove bug')
    }

    bugService.remove(bugId)
        .then(() => res.send(`Bug ${bugId} removed`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    var visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length >= 3) {

        return res.status(401).send('Wait for a bit')

    } else if (!visitedBugs.includes(bugId)) {

        visitedBugs.push(bugId)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 10 * 1000 })

    }

    console.log(`bugs watched [${visitedBugs}]`);


    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

/// users

app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/user/:userId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)

    const { body: userToUpdate } = req
    const { _id, username } = userToUpdate

    if (!_id || !username) {
        return res.status(400).send('Required fields are missing')
    }

    if (!loggedinUser || loggedinUser._id !== _id && !loggedinUser.isAdmin) {
        return res.status(400).send('Not authorized to update user')
    }

    const userToSave = { _id, username }

    userService.update(userToSave)
        .then(savedUser => res.send(savedUser))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    const { userId } = req.params

    if (!loggedinUser || !loggedinUser.isAdmin) {
        return res.status(400).send('Not authorized to remove user')
    }
    
    bugService.isUserHaveBug(userId).then(hasBugs => {

        if (hasBugs) {
            return res.status(400).send('Not authorized to remove user')
        }

        userService.remove(userId)
            .then(() => res.send(`user ${userId} removed`))
            .catch(err => {
                loggerService.error(err)
                res.status(400).send(err)
            })
    })
})


app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})


/// auth

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    const { username, password } = credentials

    if (!username || !password) {
        return res.status(400).send('Missing required credentials')
    }

    authService.login({ username, password })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    const { username, password, fullname } = credentials

    if (!username || !password || !fullname) {
        return res.status(400).send('Missing required credentials')
    }

    userService.add(credentials)
        .then(user => {

            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot Signup')
            }
        })
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('user logged out!')
})

// app.post('/api/auth/getLoggedinUser', (req, res) => {
//     const token = req.cookies.loginToken
//     const loggedinUser = authService.validateToken(token)
//     res.send(loggedinUser)
// })


app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`Server ready at port http://127.0.0.1:${PORT}`))
