// DOMinate by Adrian Sieber

function DOMinate(a,                        // Array containing the DOMfragment in JsonML
                  b,                        // placeholder
                  c                         // placeholder
    ) {

    function d(a,                           // create DOM element from syntax sugar string
               b                            // placeholder
        ) {
        a = a.split('#');                   // split string into element-name and id
        b = document.createElement(a[0]);   // create element
        b.id = a[1] || null;                // assign id if is set
        return b                            // return DOM element
    }

    if (a[0].big)                           // if is string create DOM element
        a[0] = d(a[0]);                     // else is already a DOM element

    for (c = 1; c < a.length; c++) {        // for each in the element array (except the first)
        if (a[c].big)                       // if is string has to be content
            a[0].innerHTML = a[c];          // set content

        else if (a[c].pop) {                // if is array has to be child element
            if (a[c][0].big)                // if is string create DOM element
                a[c][0] = d(a[c][0]);       // else is already a DOM element
            a[0].appendChild(a[c][0]);      // append the element to its parent element
            DOMinate(a[c])                  // use DOMinate recursively for all child elements

        } else                                  // else must be object with attributes
            for (b in a[c])                     // for each attribute
                a[0].setAttribute(b, a[c][b])   // set attribute
    }

    return a[0]                             // return DOM element
}