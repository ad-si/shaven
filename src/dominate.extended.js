/*@preserve DOMinate essential by Adrian Sieber*/

function DOMinate(a,                            // Array containing the DOMfragment in JsonML
                  ns,                           // Namespace
                  b,                            // placeholder
                  c,                            // placeholder
                  d                             // placeholder
    ) {

    d = document
    ns = ns || 'http://www.w3.org/1999/xhtml'   // Set default namespace to XHTML namespace

    function e(a,                               // create DOM element from syntax sugar string
               b,                               // placeholder)
               c
              )
    {
        b = d.createElementNS(ns, a.match(/^\w+/)[0])     // create element

        if(c = a.match(/#(\w+)/))
            b.id = c[1]                                   // assign id if is set

        if(c = a.match(/\.\w+/g))
            b.className += c.join(' ').replace(/\./g, '') // assign class if is set

        return b;                                         // return DOM element
    }

    if (a[0].big)                               // if is string create DOM element
        a[0] = e(a[0])                          // else is already a DOM element

    for (c = 1; c < a.length; c++) {            // for each in the element array (except the first)
        if (a[c].big)                           // if is string has to be content
            a[0].appendChild(d.createTextNode(a[c])); // set content

        else if (a[c].pop) {                    // if is array has to be child element
            if (a[c][0].big)                    // if is string create DOM element
                a[c][0] = e(a[c][0])            // else is already a DOM element
            a[0].appendChild(a[c][0])           // append the element to its parent element
            DOMinate(a[c], ns)                  // use DOMinate recursively for all child elements

        }

        else if(a[c].call)                      // if is function
            a[c](a[0])                          // call with current element as first argument

        else                                    // else must be object with attributes
            for (b in a[c])                     // for each attribute
                a[0].setAttribute(b, a[c][b])   // set attribute
    }

    return a[0]                                 // return DOM element
}