import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user/user-index.js"
import { UserList } from "../cmps/user/UserList.jsx"
import { BugLoader } from "../cmps/bug/BugLoader.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM

export function UserIndex({ loggedinUser }) {

    const navigate = useNavigate()

    const [users, setUsers] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (loggedinUser && loggedinUser.isAdmin) {
            loadUsers()
        } else {
            navigate('/')
        }
    }, [])

    function loadUsers() {
        setIsLoading(true)
        userService.query()
            .then(users => {
                setUsers(users)
            })
            .catch(err => {
                showErrorMsg('Failed to load users. Please try again later.')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    function onRemove(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(prev => prev.filter(u => u._id !== userId))
                showSuccessMsg('User successfully removed.')
            })
            .catch(err => {
                console.log(err);
                showErrorMsg('Cannot remove user who has bugs.')
            })
    }

    return (
        <section className="user-index">
            <h2>User List</h2>

            {users && !isLoading
                ? users.length > 0
                    ? < UserList users={users} onRemove={onRemove} loggedinUser={loggedinUser} />
                    : <div className="no-bug-msg">No User found</div>
                : <BugLoader />
            }
        </section >
    )
}