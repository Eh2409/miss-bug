

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
        dir: -1
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

const service = isRemote ? remote : local
export const bugService = { getDefaultFilter, getEmptyBug, getBugLabels, ...service }