import { Loader } from "../cmps/Loader.jsx"
import { userService } from "../services/user/user-index.js"

const { useState, useEffect, useRef } = React
const { useNavigate, useParams } = ReactRouterDOM

export function UserDetails(props) {
    const params = useParams()
    const { userId } = params

    const navigate = useNavigate()

    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        if (!loggedinUser || loggedinUser._id !== userId) {
            navigate('/')
        }
    }, [])


    if (!loggedinUser || loggedinUser._id !== userId) return <Loader />
    return (
        <section>
            <h2>Hello {loggedinUser.username}</h2>

            <div>
                <h4>change your username</h4>
                <form action="">
                    <input type="text" />
                    <button>Save</button>
                </form>
            </div>

            <div>
                <h3>My Bugs</h3>
            </div>

        </section>
    )
}