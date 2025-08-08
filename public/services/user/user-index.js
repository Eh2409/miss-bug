
import { userService as local } from "./user.service.local.js"

/// Allows me to manually control which server I use
const isRemote = false

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
    }
}

const service = local
export const userService = { getEmptyUser, ...service }