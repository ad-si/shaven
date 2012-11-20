# DOMinate
A **DOM building utility** and **Template engine** build upon **JsonML** with syntax sugar.

## Features
- **Universal:** You can easily make JsonML in almost any programming language
- **Tiny:** Only 0.3k minified and gzipped
- **DOM-ready:** Builds and returns a DOM DocumentFragment
- **Simple:** Build the JsonML Array, parse it.


```javascript
	DOMinate(
		[document.body,
			['h1#logo', 'Static Example', {style:'color:blue'}],
			['p','some example text'],
			['ul', {id:'list', class:'bullets'},
				['li', 'item1'],
                ['li.active', 'item2'],
                ['li',
                    ['a', 'item3', {href: '#'}]
                ]
			]
		]
	);
```

compiles to

```html
	<body>
		<h1 id="logo" style="color:blue">Static Example</h1>
		<p>some example text</p>
		<ul id="list" class="bullets">
			<li>item1</li>
			<li class="active">item2</li>
			<li><a href="#">item3</a></li>
		</ul>
	</body>
```


## Versions
DOMinate is available in three versions, which are based on each other.

### DOMinate essential
- 272 bytes
- Contains the basic functionality
- Attempt to build the shortest JsonML parser possible
- For projects where every byte counts

### DOMinate
- 345 bytes
- Standard version of DOMinate which keeps the balance between size and functionality
- Returns a DOM Object
- Syntax Sugar for ids

### DOMinate extended
- 0.5k bytes
- Contains all the functionality
- Syntax Sugar for ids and classes
- Support for namespaces. (Lets you build SVGs)

**Check out the examples folder for more in-depth examples**