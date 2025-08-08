

import { bugService as local } from "./bug.service.local.js"
import { bugService as remote } from "./bug.service.remote.js"

/// Allows me to manually control which server I use
const isRemote = false

function getDefaultFilter() {
    return {
        txt: '',
        minSeverity: 0,
        labels: [],
        sortType: 'createdAt',
        dir: -1,
        pageIdx: undefined,
        creatorId: '',
    }
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        severity: 0,
        labels: []
    }
}

function getBugLabels() {
    return ['critical', 'need-CR', 'dev-branch']
}

function getFilterFromSearchParams(searchParams) {

    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const field in defaultFilter) {
        if (field === 'pageIdx') {
            const pageIdxRes = searchParams.get(`pageIdx`) || defaultFilter[field]
            filterBy.pageIdx = (pageIdxRes !== 'undefined' && pageIdxRes !== undefined) ? +pageIdxRes : defaultFilter[field]
        } else if (field === 'labels') {
            filterBy[field] = searchParams.getAll('labels') || defaultFilter[field]
        } else if (field === 'dir') {
            filterBy[field] = +searchParams.get(`dir`) || defaultFilter[field]
        } else {
            filterBy[field] = searchParams.get(`${field}`) || defaultFilter[field]
        }
    }

    return filterBy

}


const service = isRemote ? remote : local
export const bugService = { getDefaultFilter, getEmptyBug, getBugLabels, getFilterFromSearchParams, ...service }