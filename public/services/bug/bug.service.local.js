import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'bugs'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    createPdf
}

function query(filterBy) {
    return storageService.query(STORAGE_KEY)
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (bugs && bugs.length > 0) return

    bugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3",
            description: "The system enters a loop that never exits, causing the application to hang indefinitely.",
            labels: ['critical', 'dev-branch']
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD",
            description: "Input device not recognized. User is unable to provide any input via keyboard.",
            labels: ['critical', 'need-CR']
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33",
            description: "Developer caffeine levels critically low. Coffee not located in expected location.",
            labels: ['critical']
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053",
            description: "Received an unexpected response from the server, causing a temporary UI glitch.",
            labels: ['dev-branch']
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}


function createPdf() {
    return Promise.reject('PDF creation is not supported on the local service.')
}