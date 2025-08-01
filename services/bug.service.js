
import { loggerService } from './logger.service.js'
import { makeId, readJsonFile, writeJsonFile } from './util.service.js'


export const bugService = {
    query,
    getById,
    remove,
    add,
    update
}

const bugs = readJsonFile('data/bug.json')

const PAGE_SIZE = 8

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

            if (filterBy.labels.length > 0) {
                filteredBugs = filteredBugs.filter(bug => {
                    return bug.labels.some(label => filterBy.labels.includes(label))
                })
            }

            if (filterBy.sortType && filterBy.dir) {

                if (filterBy.sortType === 'severity') {
                    filteredBugs = filteredBugs.sort((b1, b2) => (b1.severity - b2.severity) * filterBy.dir)
                } else if (filterBy.sortType === 'createdAt') {
                    filteredBugs = filteredBugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * filterBy.dir)
                } else if (filterBy.sortType === 'title') {
                    filteredBugs = filteredBugs.sort((b1, b2) => (b1.title.localeCompare(b2.title)) * filterBy.dir)
                }
            }


            const maxPageCount = Math.ceil(filteredBugs.length / PAGE_SIZE)


            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
            }


            return { bugs: filteredBugs, maxPageCount }
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

function add(bugToSave) {
    bugToSave._id = makeId()
    bugToSave.createdAt = Date.now()
    bugs.unshift(bugToSave)
    return _saveBugs().then(() => bugToSave)
}

function update(bugToSave) {
    const idx = bugs.findIndex(bug => bug._id === bugToSave._id)

    if (idx === -1) {
        loggerService.error(`Cannot find bug ${bugToSave._id}`)
        return Promise.reject(`Cannot update bug`)
    }
    bugs[idx] = { ...bugs[idx], ...bugToSave }
    return _saveBugs().then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('data/bug.json', bugs)
}