import PDFDocument from 'pdfkit-table'
import { readJsonFile } from './util.service.js'

const bugs = readJsonFile('data/bug.json')

export function generatePdf(dataCallback, endCallback) {
    return new Promise((resolve, reject) => {

        let doc = new PDFDocument({ margin: 30, size: 'A4' })

        doc.on('data', dataCallback)
        doc.on('end', () => {
            endCallback()
            resolve()
        })
        doc.on('error', err => reject(err))

        createPdfTable(doc)
            .then(() => doc.end())
            .catch(reject)
    })

}

function createPdfTable(doc) {
    const table = {
        title: 'Bugs Report',
        subtitle: 'Detailed Bug Report',
        headers: ['Title', 'Severity', 'Description'],
        rows: bugs.map(b => [b.title, b.severity, b.description]),
    }
    return doc.table(table, { columnsSize: [200, 100, 200] })
}