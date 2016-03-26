// Piwik analytics
// jscs:disable disallowDanglingUnderscores
var _paq = _paq || []
_paq.push(['trackPageView'])
_paq.push(['enableLinkTracking'])

!function () {
	var u = '//piwik.adriansieber.com/'
	var d
	var g
	var s

	_paq.push(['setTrackerUrl', u + 'piwik.php'])
	_paq.push(['setSiteId', 25])

	d = document
	g = d.createElement('script')
	s = d.getElementsByTagName('script')[0]

	g.type = 'text/javascript'
	g.async = true
	g.defer = true
	g.src = u + 'piwik.js'
	s.parentNode.insertBefore(g, s)
}()
