
import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'


export const bugService = {
    query,
    getById,
    remove,
    save,
}

const bugs = readJsonFile('data/bug.json')

function query(filterBy = {}) {
    return Promise.resolve(bugs)
        .then(bugs => {
            var filteredBugs = structuredClone(bugs)

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return filteredBugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject(`cannot find bug ${bugId}`)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)

    if (idx === -1) {
        loggerService.error(`Cannot find bug ${bugId}`)
        return Promise.reject(`Cannot remove bug`)
    }

    bugs.splice(idx, 1)
    return _saveBugs()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)

        if (idx === -1) {
            loggerService.error(`Cannot find bug ${bugToSave._id}`)
            return Promise.reject(`Cannot update bug`)
        }
        bugs[idx] = { ...bugs[idx], ...bugToSave }
    } else {
        bugToSave._id = makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }
    return _saveBugs().then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('data/bug.json', bugs)
}