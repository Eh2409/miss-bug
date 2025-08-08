const { Link } = ReactRouterDOM
const { Fragment } = React
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, loggedinUser }) {

    function canUpdatebug(bug) {
        if (!loggedinUser) return false
        if (loggedinUser.isAdmin) return true
        return bug.creator._id === loggedinUser._id
    }

    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <Link to={`/bug/${bug._id}`} className="btn">Details</Link>
                    {canUpdatebug(bug) &&
                        <Fragment>
                            <Link to={`/bug/edit/${bug._id}`} className="btn">Edit</Link>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        </Fragment>
                    }
                </section>
            </li>
        ))}
    </ul >
}
