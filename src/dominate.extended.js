// DOMinate by Adrian Sieber

function DOMinate(a, b, c) {

    function d(a, b) {
        a = a.split('#');
        b = document.createElement(a[0]);
        a = a[1]? a[1].split('.') : '';
        b.id = a[0] || null;
        b.className = a[1] || null;
        return b
    }

    if (a[0].big)
        a[0] = d(a[0]);

    for (c = 1; c < a.length; c++) {
        if (a[c].big)
            a[0].innerHTML = a[c];

        else if (a[c].pop) {
            if (a[c][0].big)
                a[c][0] = d(a[c][0]);
            a[0].appendChild(a[c][0]);
            DOMinate(a[c])

        } else
            for (b in a[c])
                a[0].setAttribute(b, a[c][b])
    }

    return a[0]
}