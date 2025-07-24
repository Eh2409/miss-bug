import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { generatePdf } from './services/pdf.service.js'

const app = express()
app.use(express.static('public'))


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

app.get('/api/bug/save', (req, res) => {
    const { _id, title, description, severity, createdAt } = req.query

    if (!title || !description || !severity) {
        res.status(400).send('Required fields are missing')
    }

    const bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        createdAt
    }

    console.log(bugToSave);

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
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

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

const port = 3030
app.listen(port, () => console.log(`Server ready at port http://127.0.0.1:${port}`))
