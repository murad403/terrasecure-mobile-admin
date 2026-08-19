const formatDate = (dateInput?: Date | string | null) => {
    if (!dateInput) return 'N/A'
    const parsed = new Date(dateInput)
    if (isNaN(parsed.getTime())) return 'N/A'
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default formatDate;