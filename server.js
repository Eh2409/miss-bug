import path from 'path'
import express from 'express'
import cookieParse from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { generatePdf } from './services/pdf.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParse())


app.get('/api/bug', (req, res) => {

    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
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
    const bug = req.body

    const { title, description, severity } = bug

    if (!title || !description || !severity) {
        res.status(400).send('Required fields are missing')
    }

    const bugToSave = {
        title,
        description,
        severity: +severity,
    }

    console.log(bugToSave);

    bugService.add(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    console.log('req:', req)

    const { body: bug } = req
    console.log('bug:', bug)

    const { _id, title, description, severity, createdAt } = bug

    if (!_id || !title || !description || !severity) {
        res.status(400).send('Required fields are missing')
    }

    const bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        createdAt: +createdAt
    }

    console.log(bugToSave);

    bugService.update(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

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

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () => console.log(`Server ready at port http://127.0.0.1:${port}`))
