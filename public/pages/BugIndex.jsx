const { useState, useEffect, useRef } = React
const { Link } = ReactRouterDOM

import { bugService } from '../services/bug/index.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/bug/BugFilter.jsx'
import { BugList } from '../cmps/bug/BugList.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    const createPdfBtnRef = useRef()

    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
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

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onMakePdf() {
        bugService.createPdf()
            .then(blob => {
                const url = window.URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.href = url
                a.download = 'bugs-report.pdf'
                document.body.appendChild(a)
                a.click()
                a.remove()

                window.URL.revokeObjectURL(blob)
                showSuccessMsg('PDF download started!')
            })
            .catch((err) => showErrorMsg(`Failed to generate PDF`, err))
    }

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <Link to='/bug/edit'><button>Add Bug</button></Link>
            <button onClick={onMakePdf}>Pdf</button>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug} />
    </section>
}
