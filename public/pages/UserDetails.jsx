import { BugList } from "../cmps/bug/BugList.jsx"
import { BugLoader } from "../cmps/bug/BugLoader.jsx"
import { Loader } from "../cmps/Loader.jsx"
import { Pagination } from "../cmps/Pagination.jsx"
import { bugService } from "../services/bug/index.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user/user-index.js"


const { useState, useEffect, useRef } = React
const { useNavigate, useParams, NavLink } = ReactRouterDOM

export function UserDetails({ loggedinUser, setLoggedinUser }) {

    const params = useParams()
    const { userId, btnType } = params

    const navigate = useNavigate()

    const [bugs, setBugs] = useState(null)
    const [pageIdx, setPageIdx] = useState(undefined)
    const [maxPageCount, setMaxPageCount] = useState(0)
    const [isbugsLoading, setIsbugsLoading] = useState({ isLoading: false, isFiretTime: true })
    const [newUsername, setNewUsername] = useState('')

    useEffect(() => {
        if (loggedinUser && loggedinUser._id === userId) {
            if (btnType === 'myBugs') {
                loadBugs()
            }
        } else {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        loadBugs()
    }, [pageIdx])


    function loadBugs() {
        const start = performance.now()
        setIsbugsLoading(prev => ({ ...prev, isLoading: true }))

        bugService.query({ pageIdx: pageIdx, creatorId: userId })
            .then(({ bugs, maxPageCount }) => {
                setBugs(bugs)
                setMaxPageCount(maxPageCount)

                const end = performance.now()
                const duration = ((end - start) / 1000).toFixed(2)

                if (isbugsLoading.isFiretTime && +duration < 0.5) {
                    setTimeout(() => {
                        setIsbugsLoading(prev => ({ isLoading: false, isFiretTime: false }))
                    }, 500)
                } else if (isbugsLoading.isFiretTime) {
                    setIsbugsLoading(prev => ({ isLoading: false, isFiretTime: false }))
                } else {
                    setIsbugsLoading(prev => ({ ...prev, isLoading: false }))
                }

            })
            .catch(err => {
                showErrorMsg(`Couldn't load bugs - ${err}`)
                setIsbugsLoading(prev => ({ isLoading: false, isFiretTime: false }))
            })

    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onSetPageIdx(pageNum) {
        setPageIdx(pageNum)
    }

    function togglePagination({ target }) {
        const pageIdx = target.checked ? 0 : undefined

        setPageIdx(pageIdx)
    }

    /// user settings 

    function handleChange({ target }) {
        var { value } = target
        setNewUsername(value)
    }

    function onSaveUpdate(ev) {
        ev.preventDefault()
        const updatedUser = { _id: loggedinUser._id, username: newUsername }

        userService.update(updatedUser)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg('Username updated successfully!')
                setNewUsername('')
            })
            .catch(err => {
                showErrorMsg(err || 'Could not update username. Please try again later.')
            })
    }

    if (!loggedinUser || loggedinUser._id !== userId) return <Loader />
    return (
        <section className="user-details">

            <h2>Hello {loggedinUser.username}</h2>

            <nav className="user-details-nav">
                <NavLink to={`/user/${loggedinUser._id}/settings`}>My Settings</NavLink>
                <NavLink to={`/user/${loggedinUser._id}/myBugs`}>My Bugs</NavLink>
            </nav>

            {btnType === 'settings' && <section className="settings">
                <h4>Change your username</h4>
                <form onSubmit={onSaveUpdate}>
                    <input type="text" name="username" value={newUsername} onChange={handleChange} />
                    <button disabled={!newUsername}>Save</button>
                </form>
            </section>}

            {btnType === 'myBugs' && <section>
                <h3>My Bugs</h3>

                {bugs && !isbugsLoading.isLoading ? <BugList
                    bugs={bugs}
                    onRemoveBug={onRemoveBug}
                    loggedinUser={loggedinUser}
                />
                    : <BugLoader />
                }

                {bugs && !bugs.length && <div className='no-bug-msg'>No Bugs found</div>}


                {(maxPageCount !== 0 && pageIdx !== undefined) && < Pagination
                    maxPageCount={maxPageCount}
                    pageIdx={pageIdx}
                    setPageIdx={onSetPageIdx}
                />}


                {bugs && bugs.length > 0 && <div className='Pagination-toggle'>
                    <span>{pageIdx !== undefined ? 'Pagination: On' : 'Pagination: Off'}</span>
                    <label className="switch">
                        <input type="checkbox" checked={pageIdx !== undefined} onChange={togglePagination} />
                        <span className="slider round"></span>
                    </label>
                </div>}
            </section>}

        </section>
    )
}