import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'
import { userService } from '../user/user.service.local.js'

const STORAGE_KEY = 'bugs'
const PAGE_SIZE = 8

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    createPdf,
    isUserHaveBug
}

function query(filterBy) {
    return storageService.query(STORAGE_KEY)
        .then(bugs => {

            if (filterBy.creatorId) {
                bugs = bugs.filter(bug => bug.creator._id === filterBy.creatorId)
            }

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            if (filterBy.labels && filterBy.labels.length > 0) {
                bugs = bugs.filter(bug => {
                    return bug.labels.some(label => filterBy.labels.includes(label))
                })
            }

            if (filterBy.sortType && filterBy.dir) {

                if (filterBy.sortType === 'severity') {
                    bugs = bugs.sort((b1, b2) => (b1.severity - b2.severity) * filterBy.dir)
                } else if (filterBy.sortType === 'createdAt') {
                    bugs = bugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * filterBy.dir)
                } else if (filterBy.sortType === 'title') {
                    bugs = bugs.sort((b1, b2) => (b1.title.localeCompare(b2.title)) * filterBy.dir)
                }
            }


            const maxPageCount = Math.ceil(bugs.length / PAGE_SIZE)

            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }

            return { bugs, maxPageCount }
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
        const user = userService.getLoggedinUser()
        bug.creator = { _id: user._id, username: user.username }
        bug.createdAt = Date.now()
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
            createdAt: 1646524800, // 	3/5/2022		
            labels: ['critical', 'dev-branch'],
            creator: {
                _id: "100b",
                username: "shlomka123"
            }
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD",
            description: "Input device not recognized. User is unable to provide any input via keyboard.",
            createdAt: 1717372800, // 	6/3/2024		
            labels: ['critical', 'need-CR'],
            creator: {
                _id: "101b",
                username: "barash87"
            }
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33",
            description: "Developer caffeine levels critically low. Coffee not located in expected location.",
            createdAt: 931536000, // 	7/3/1999	
            labels: ['critical'],
            creator: {
                _id: "102b",
                username: "adminQueen"
            }
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053",
            description: "Received an unexpected response from the server, causing a temporary UI glitch.",
            createdAt: 1120972800, // 	7/10/2005		
            labels: ['dev-branch'],
            creator: {
                _id: "103b",
                username: "tailfighter99"
            }
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}


function createPdf() {
    return Promise.reject('PDF creation is not supported on the local service.')
}

function isUserHaveBug(userId) {
    return storageService.query(STORAGE_KEY)
        .then(bugs => {
            return bugs.some(b => b.creator._id === userId)
        })
}