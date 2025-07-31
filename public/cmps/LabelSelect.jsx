const { useState, useEffect, useRef } = React

export function LabelSelect({ bugLabels, onSaveLabels, labelOptions }) {

    const [labels, setLabels] = useState([])
    const [isLabelsBoxOpen, setIsLabelsBoxOpen] = useState(false)

    const selectionBoxRef = useRef()
    const labelInputRef = useRef()

    useEffect(() => {
        setLabels(bugLabels)
    }, [])

    useEffect(() => {
        if (isLabelsBoxOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })

    }, [labels, isLabelsBoxOpen])

    function handleClickOutside({ target }) {

        if (target !== selectionBoxRef.current && !selectionBoxRef.current.contains(target)) {

            if (target !== labelInputRef.current) setIsLabelsBoxOpen(false)
            submitLabels()
        }
    }

    function handleChange({ target }) {
        var { value } = target

        setLabels(prev => {

            if (prev.includes(value)) {
                prev = prev.filter(l => l !== value)
            } else {
                prev = [...prev, value]
            }

            return prev
        })
    }

    function toggleIsLabelsBoxOpen() {
        setIsLabelsBoxOpen(!isLabelsBoxOpen)
    }

    function submitLabels() {
        onSaveLabels(labels)
    }

    return (
        <section className="label-select">

            <div className="input labels-prev" onClick={toggleIsLabelsBoxOpen} ref={labelInputRef}>
                <span>
                    {labels.length > 0 ? labels.join(", ") : 'Select Labels'}
                </span>
            </div>

            <div className={`input label-selection-box ${isLabelsBoxOpen ? 'box-open' : ''}`} ref={selectionBoxRef}>
                {labelOptions.length > 1 && labelOptions.map((label, idx) => {
                    return <label htmlFor={label} key={idx}>
                        <input type="checkbox"
                            name="labels"
                            id={label}
                            value={label}
                            checked={labels.includes(label)}
                            onChange={handleChange} />
                        {label}
                    </label>
                })}
            </div>

        </section>
    )
}