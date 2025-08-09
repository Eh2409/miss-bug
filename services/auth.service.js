import Cryptr from 'cryptr'
import { userService } from "./user.service.js"

const cryptr = new Cryptr(process.env.SERCRET1 || 'secret-bug-1000')

export const authService = {
    login,
    getLoginToken,
    validateToken,
}


function login({ username, password }) {

    if (!username || !password) {
        return Promise.reject('Missing required credentials')
    }

    return userService.getByUsername(username).then(user => {

        if (!user || user.password !== password) {
            return Promise.reject('username or password is incorrect')
        }
        user = { ...user }
        delete user.password
        return Promise.resolve(user)
    })
}

export function getLoginToken(user) {
    user = {
        _id: user._id,
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }

    const str = JSON.stringify(user)
    const loginToken = cryptr.encrypt(str)
    return loginToken
}

function validateToken(token) {
    if (!token) return null
    const json = cryptr.decrypt(token)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}
