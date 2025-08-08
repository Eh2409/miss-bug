
import { userService as local } from "./user.service.local.js"
import { userService as remote } from "./user.service.remote.js"

/// Allows me to manually control which server I use
const isRemote = true

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
    }
}

const service = isRemote ? remote : local
export const userService = { getEmptyUser, ...service }