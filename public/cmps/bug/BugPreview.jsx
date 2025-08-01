export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        {/* <p className="title">{new Date(bug.createdAt).toLocaleDateString("en-US")}</p> */}
        <p className="bug-labels">
            {bug.labels && bug.labels.length > 0 && bug.labels.map(label => {
                return <span key={label} className="btn">{label}</span>
            })}
        </p>
        <p className="bug-severity">Severity: <span>{bug.severity}</span></p>
    </article>
}