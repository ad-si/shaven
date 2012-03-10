// DOMinate extended by Adrian Sieber

function DOMinate(a,                            // Array containing the DOMfragment in JsonML
                  ns,                           // Namespace
                  b,                            // placeholder
                  c,                            // placeholder
                  d                             // placeholder
    ) {

    d = document;
    ns = ns || 'http://www.w3.org/1999/xhtml';  // Set default namespace to XHTML namespace

    function e(a,                               // create DOM element from syntax sugar string
               b                                // placeholder
        ) {
        a = a.split('#');                       // split string into element-name and id-class
        b = d.createElementNS(ns, a[0]);        // create element
        a = a[1]? a[1].split('.') : '';         // split string into id and class
        b.id = a[0] || null;                    // assign id if is set
        b.className = a[1] || null;             // assign class if is set
        return b                                // return DOM element
    }

    if (a[0].big)                               // if is string create DOM element
        a[0] = e(a[0]);                         // else is already a DOM element

    for (c = 1; c < a.length; c++) {            // for each in the element array (except the first)
        if (a[c].big)                           // if is string has to be content
            a[0].appendChild(d.createTextNode(a[c])); // set content

        else if (a[c].pop) {                    // if is array has to be child element
            if (a[c][0].big)                    // if is string create DOM element
                a[c][0] = e(a[c][0]);           // else is already a DOM element
            a[0].appendChild(a[c][0]);          // append the element to its parent element
            DOMinate(a[c], ns)                  // use DOMinate recursively for all child elements

        } else                                  // else must be object with attributes
            for (b in a[c])                     // for each attribute
                a[0].setAttribute(b, a[c][b])   // set attribute
    }

    return a[0]                                 // return DOM element
}