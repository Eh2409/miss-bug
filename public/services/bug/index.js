

import { bugService as local } from "./bug.service.local.js"
import { bugService as remote } from "./bug.service.remote.js"

/// Allows me to manually control which server I use
const isRemote = true

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        severity: 0,
    }
}

const service = isRemote ? remote : local
export const bugService = { getDefaultFilter, getEmptyBug, ...service }