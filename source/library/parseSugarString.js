export default (sugarString) => {
	const tags = sugarString.match(/^[\w-]+/)
	const properties = {
		tag: tags ? tags[0] : 'div',
		// Don't escape HTML content if string ends with &
		escapeHTML: !sugarString.endsWith('&'),
	}
	const ids = sugarString.match(/#([\w-]+)/)
	const classes = sugarString.match(/\.[\w-]+/g)
	const references = sugarString.match(/\$([\w-]+)/)

	if (ids)
		properties.id = ids[1]

	if (classes)
		properties.class = classes.join(' ').replace(/\./g, '')

	if (references)
		properties.reference = references[1]

	return properties
}
