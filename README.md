# Shaven

A **DOM building utility** and **Template engine** build upon **JsonML** with syntax sugar.

Checkout [adriansieber.com/shaven](http://adriansieber.com/shaven) for an extensive documentation.


```javascript
	shaven(
		[document.body,
			['h1#logo', 'Static Example', {style:'color:blue'}],
			['p','some example text'],
			['ul#list.bullets'},
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

## Features

- Syntax Sugar for ids, classes and variable caching
- Support for namespaces. (Lets you build SVGs and other XML based languages)
- Callback functions on elements
- Returns a Object containing the root element and the elements with an id
