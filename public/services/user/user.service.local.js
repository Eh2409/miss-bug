import { utilService } from '../util.service.js'
import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'user'

_createUsers()

export const userService = {
    query,
    getById,
    getByUsername,
    add,
    update,
    remove,

    // auth 

    signup,
    login,
    logout,
    getLoggedinUser,
}


function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY).then(users => {
        var filteredUsers = users

        filteredUsers.map(user => delete user.password)

        filteredUsers = filteredUsers.sort((u1, u2) => (u1.createdAt - u2.createdAt) * -1)

        return filteredUsers
    })
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function getByUsername(username) {
    return storageService.query(STORAGE_KEY).then(users => {
        const user = users.find(user => user.username === username)
        return user
    })
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}

function add(credentials) {
    const { username, password, fullname } = credentials

    if (!username || !password || !fullname) {
        return Promise.reject('Missing required credentials')
    }

    return getByUsername(username).then(isUserNameTaken => {

        if (isUserNameTaken) {
            return Promise.reject('Username is taken')
        }

        const userToSave = {
            username,
            password,
            fullname,
            isAdmin: false,
            createdAt: Date.now()
        }

        return storageService.post(STORAGE_KEY, userToSave).then(user => {
            delete user.password
            return user
        })
    })
}

function update(updatedUser) {
    const { _id, username } = updatedUser

    if (!_id || !username) {
        return Promise.reject('Missing required credentials')
    }

    return getByUsername(username).then(isUserNameTaken => {
        if (isUserNameTaken) {
            return Promise.reject('Username is taken')
        }

        return getById(_id).then(user => {
            const userToSave = { ...user, username }

            return storageService.put(STORAGE_KEY, userToSave).then(user => {
                delete user.password

                return _setLoginToken(user)
            })
        })
    })
}


function _createUsers() {
    let users = utilService.loadFromStorage(STORAGE_KEY)
    if (users && users.length > 0) return

    users = [
        {
            _id: '100b',
            username: 'shlomka123',
            password: 'applePower1!',
            fullname: 'Shlomka Ben-Tzvi',
            isAdmin: false,
            createdAt: Date.now()
        },
        {
            _id: '101b',
            username: 'barash87',
            password: 'streetKing$',
            fullname: 'Barash HaPach',
            isAdmin: false,
            createdAt: Date.now()
        },
        {
            _id: '102b',
            username: 'adminQueen',
            password: 'secureAdmin42!',
            fullname: 'Dvora Malka',
            isAdmin: true,
            createdAt: Date.now()
        },
        {
            _id: '103b',
            username: 'tailfighter99',
            password: 'waterTail9#',
            fullname: 'Yinon Mizrahi',
            isAdmin: false,
            createdAt: Date.now()
        },
        {
            _id: '104b',
            username: 'e33',
            password: 'E3333',
            fullname: 'eliad',
            isAdmin: true,
            createdAt: Date.now()
        },

    ]
    utilService.saveToStorage(STORAGE_KEY, users)
}


/// auth functions

const LOGGEDIN_USER_KEY = 'loggedin user'


function signup(credentials) {
    const { username, password, fullname } = credentials

    if (!username || !password || !fullname) {
        return Promise.reject('Missing required credentials')
    }

    return userService.add(credentials).then(account => {
        if (account) {
            console.log(`account created for user ${account.username}`)

            return login({ username, password })

        } else {
            return Promise.reject()
        }
    })

}

function login({ username, password }) {

    if (!username || !password) {
        return Promise.reject('Missing required credentials')
    }

    return userService.getByUsername(username).then(user => {

        if (!user) {
            return Promise.reject('username or password is incorrect')
        }

        if (user.password !== password) {
            return Promise.reject('username or password is incorrect')
        }

        delete user.password

        return _setLoginToken(user)
    })
}

function logout() {
    sessionStorage.removeItem(LOGGEDIN_USER_KEY)
    return Promise.resolve()
}

export function _setLoginToken(user) {
    user = {
        _id: user._id,
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(LOGGEDIN_USER_KEY, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    const json = sessionStorage.getItem(LOGGEDIN_USER_KEY)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}
