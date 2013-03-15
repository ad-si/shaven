/*@preserve DOMinate essential by Adrian Sieber*/

DOMinate = function(a, b, c, x) {

	function d(a) {
		return document.createElement(a)
	}

	if (a[0].big)
		a[0] = d(a[0]);

	for (c = 1; c < a.length; c++) {

		x = a[c]

		if (x.big)
			a[0].innerHTML = x

		else if (x.pop)
			DOMinate(x),
			a[0].appendChild(x[0])

		else
			for (b in x)
				a[0].setAttribute(b, x[b])
	}
}