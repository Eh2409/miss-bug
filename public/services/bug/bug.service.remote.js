const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    createPdf
}


function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const bugId = bug._id || ''

    return axios[method](BASE_URL + '/' + bugId, bug)
        .then(res => res.data)
}

function createPdf() {
    return axios.get(BASE_URL + '/pdf', { responseType: 'blob' })
        .then(res => res.data)
}