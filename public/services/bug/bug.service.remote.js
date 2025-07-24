const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove
}


function query(filterBy = {}) {
    const { txt, minSeverity } = filterBy
    const queryStr = `?txt=${txt}&minSeverity=${minSeverity}`
    return axios.get(BASE_URL + queryStr)
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + '/remove')
        .then(res => res.data)
}

function save(bug) {
    const { _id, title, description, severity, createdAt } = bug
    const queryStr = `?_id=${_id || ''}&title=${title}&description=${description}&severity=${severity}&createdAt=${createdAt || ''}`
    return axios.get(BASE_URL + '/save' + queryStr)
        .then(res => res.data)
}