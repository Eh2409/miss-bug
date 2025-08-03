const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug }) {

    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <Link to={`/bug/${bug._id}`} className="btn">Details</Link>
                    <Link to={`/bug/edit/${bug._id}`} className="btn">Edit</Link>
                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
