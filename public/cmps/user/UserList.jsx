import { UserPreview } from "./UserPreview.jsx"

export function UserList({ users, onRemove, loggedinUser }) {
    return (
        <ul className="user-list">
            {users.map(user => {
                return <li key={user._id} className="user-item">
                    <UserPreview user={user} />
                    <div>
                        <button
                            disabled={loggedinUser._id === user._id}
                            title={loggedinUser._id === user._id ? "Cannot remove yourself" : "Remove User"}
                            onClick={() => { onRemove(user._id) }}>
                            Remove user
                        </button>
                    </div>
                </li>
            })}
        </ul>)
}