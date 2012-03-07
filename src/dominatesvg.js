// DOMinateSVG by Adrian Sieber

function DOMinateSVG(a, b, c) {

    function d(a, b) {
        a = a.split("#");
        b = document.createElementNS("http://www.w3.org/2000/svg", a[0]);
        b.id = a[1] || null;
        return b
    }

    if (a[0].big) a[0] = d(a[0]);

    for (c = 1; c < a.length; c++) {
        if (a[c].big)
            a[0].innerHTML = a[c];

        else if (a[c].pop)
            a[c][0] = d(a[c][0]),
            a[0].appendChild(a[c][0]),
            DOMinateSVG(a[c])

        else
            for (b in a[c])
                a[0].setAttribute(b, a[c][b])
    }

    return a[0]
}