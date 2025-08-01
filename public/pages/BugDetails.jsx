const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM


import { bugService } from '../services/bug/index.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [])

    return <div className="bug-details">
        <h3>Bug Details</h3>
        {!bug && <p className="loading">Loading....</p>}
        {
            bug &&
            <div className='bug-info'>
                <h4>{bug.title}</h4>
                <div className="bug-labels">
                    {bug.labels.length > 0 && bug.labels.map(label => {
                        return <span key={label} className="btn">{label}</span>
                    })}
                </div>
                <h5>Severity: <span>{bug.severity}</span></h5>
                <pre>{bug.description}</pre>
            </div>
        }
        <hr />
        <Link to="/bug">Back to List</Link>
    </div>

}