const BASE_URL = '/api/user'
const AUTH_URL = '/api/auth'

export const userService = {
    query,
    getById,
    update,
    remove,
    //auth
    signup,
    login,
    logout,
    getLoggedinUser
}

const LOGGEDIN_USER_KEY = 'loggedin user'

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + '/' + userId)
        .then(res => res.data)
}

function remove(userId) {
    return axios.delete(BASE_URL + '/' + userId)
        .then(res => res.data)
}

function update(updatedUser) {
    const userId = updatedUser._id

    return axios.put(BASE_URL + '/' + userId, updatedUser)
        .then(res => _setLoggedinUser(res.data))
}

// auth

function signup(credentials) {
    return axios.post(AUTH_URL + '/signup', credentials)
        .then(res => _setLoggedinUser(res.data))
}
function login(credentials) {
    return axios.post(AUTH_URL + '/login', credentials)
        .then(res => _setLoggedinUser(res.data))
}
function logout() {
    return axios.post(AUTH_URL + '/logout')
        .then(() => {
            sessionStorage.removeItem(LOGGEDIN_USER_KEY)
            return Promise.resolve()
        })
}

export function _setLoggedinUser(user) {
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
