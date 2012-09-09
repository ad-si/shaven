# DOMinate
A **DOM building utility** and **Template engine** build upon **JsonML** with syntax sugar.

## Features
- **Universal:** You can easily make JsonML in almost any programming language
- **Tiny:** Only 0.3k minified and gzipped
- **DOM-ready:** Returns a DOM DocumentFragment
- **Simple:** Build the JsonML Array, parse it.

## Versions
DOMinate is available in three versions, which are based on each other.

### DOMinate essential
- Contains the basic functionality
- Attempt to build the shortest JsonML parser possible (only 272 bytes)
- For projects where every byte counts

```javascript
	DOMinate(
		[document.body,
			['h1', 'Static Example', {'id':'logo', 'style':'color:blue'}],
			['p','some example text'],
			['ul', {'id':'list', class:'bullets'}],
				['li', 'item1'],
                ['li', 'item2', {'class': 'active'}],
                ['li',
                    ['a', 'item3', {'href': '#'}]
                ]
			]
		]
	);
```


### DOMinate
- Standard version of DOMinate which keeps the balance between size and functionality (345 bytes)
- Returns a DOM Object
- Syntax Sugar for ids

```javascript
	var content = DOMinate(
		[document.body,
			['h1#logo', 'Static Example', {'style':'color:blue'}],
			['p','some example text'],
			['ul#list', {class:'bullets'}],
				['li', 'item1'],
                ['li', 'item2', {'class': 'active'}],
                ['li',
                    ['a', 'item3', {'href': '#'}]
                ]
			]
		]
	);
```


### DOMinate extended
- Contains all the functionality (467 bytes)
- Syntax Sugar for classes
- Support for namespaces. (Lets you build SVGs)


** Check out the examples folder **