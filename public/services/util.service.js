export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    loadFromStorage,
    saveToStorage,
    cleanSearchParams
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


function loadFromStorage(keyDB) {
    const val = localStorage.getItem(keyDB)
    return JSON.parse(val)
}

function saveToStorage(keyDB, val) {
    const valStr = JSON.stringify(val)
    localStorage.setItem(keyDB, valStr)
}

function cleanSearchParams(searchParams) {

    const cleanedParams = {}

    for (const field in searchParams) {
        if (field === 'pageIdx') {
            cleanedParams[field] = searchParams[field]
        } else if (searchParams[field]) {
            cleanedParams[field] = searchParams[field]
        }
    }

    return cleanedParams
}
