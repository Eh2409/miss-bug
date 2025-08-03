const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

import { LabelSelect } from "../cmps/LabelSelect.jsx"
import { Loader } from "../cmps/Loader.jsx"
import { bugService } from "../services/bug/index.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function BugEdit(props) {
    const params = useParams()
    const { bugId } = params

    const navigate = useNavigate()
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())

    useEffect(() => {
        if (bugId) {
            getBug(bugId)
        }
    }, [])

    function handleChange({ target }) {
        var { name, value, type } = target

        if (type === 'number') value = +value

        setBugToEdit(prev => ({ ...prev, [name]: value }))
    }

    function onSaveBug(ev) {
        ev.preventDefault()

        bugService.save(bugToEdit)
            .then(savedBug => {
                showSuccessMsg('Bug saved')
                navigate(`/bug/${savedBug._id}`)
            })
            .catch(err => showErrorMsg(`Cannot save bug`, err))
    }

    function getBug(bugId) {
        bugService.getById(bugId)
            .then(bug => setBugToEdit(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }

    function onSaveLabels(labelsToSave) {

        const sortedCurrent = [...bugToEdit.labels].sort()
        const sortedNew = [...labelsToSave].sort()

        if (JSON.stringify(sortedCurrent) === JSON.stringify(sortedNew)) return

        setBugToEdit(prev => ({ ...prev, labels: labelsToSave }))
    }

    if (bugId && !bugToEdit._id) return <Loader />

    const { title, description, severity, labels } = bugToEdit
    return (
        <section className="bug-edit">
            <h2>{bugId ? "Update Bug" : "Add Bug"}</h2>
            <form onSubmit={onSaveBug}>

                <label htmlFor="title">Title: </label>
                <input type="text" name="title" id="title" value={title} onChange={handleChange} required />

                <label htmlFor="severity">Severity: </label>
                <input type="number" name="severity" id="severity" min={1} max={10} value={severity || ''} onChange={handleChange} required />

                <label htmlFor="description">Description: </label>
                <textarea type="text" name="description" id="description" value={description} onChange={handleChange} required />

                <div>Labels: </div>
                <LabelSelect
                    bugLabels={labels}
                    onSaveLabels={onSaveLabels}
                    labelOptions={bugService.getBugLabels()}
                />

                <button>Save</button>
            </form>
        </section>
    )
}