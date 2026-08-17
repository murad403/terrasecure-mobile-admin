const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A'
    const parsed = new Date(dateStr)
    if (isNaN(parsed.getTime())) return 'N/A'
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default formatDate;