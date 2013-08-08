!function() {

	var input1,
		output1,
		input2,
		output2,
		input3,
		output3,
		input4,
		output4,
		c = console,
		config = {theme: "twilight"},
		input1Value = "[\'div#demo\',\n\t[\'h1#logo\', \'Static Example\', {style: \'color:blue\'}],\n\t[\'p\', \'some example text\'],\n\t[\'ul#list.bullets\',\n\t\t[\'li\', \'item1\'],\n\t\t[\'li.active\', \'item2\'],\n\t\t[\'li\',\n\t\t\t[\'a\', \'item3\', {href: \'#\'}]\n\t\t]\n\t]\n]"

	CodeMirror.defaults.theme = "twilight"
	CodeMirror.defaults.indentWithTabs = true
	CodeMirror.defaults.indentUnit = 4
	CodeMirror.defineExtension("autoFormat", function() {

		var cm = this,
			totalLines = cm.lineCount(),
			totalChars = cm.getValue().length,
			from = {line: 0, ch: 0},
			to = {line: totalLines, ch: totalChars},
			outer = cm.getMode(),
			text = cm.getRange(from, to).split("\n"),
			state = CodeMirror.copyState(outer, cm.getTokenAt(from).state),
			tabSize = cm.getOption("tabSize"),
			out = "",
			lines = 0,
			atSol = from.ch == 0,
			i,
			stream,
			inner,
			style,
			cur

		function newline() {
			out += "\n"
			atSol = true
			++lines
		}

		for(i = 0; i < text.length; ++i) {

			stream = new CodeMirror.StringStream(text[i], tabSize)

			while(!stream.eol()) {

				inner = CodeMirror.innerMode(outer, state)
				style = outer.token(stream, state)
				cur = stream.current()

				stream.start = stream.pos

				if(!atSol || /\S/.test(cur)) {
					out += cur
					atSol = false
				}

				if(!atSol && inner.mode.newlineAfterToken &&
					inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i + 1] || "", inner.state))
					newline()
			}

			if(!stream.pos && outer.blankLine) outer.blankLine(state)

			if(!atSol) newline()
		}

		cm.operation(function() {

			cm.replaceRange(out, from, to)

			for(var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
				cm.indentLine(cur, "smart")

			//cm.setSelection(from, cm.getCursor(false))
		})
	})

	input1 = CodeMirror(document.getElementById("input1"), {
		value: input1Value
	})

	output1 = CodeMirror(document.getElementById("output1"), {
		value: DOMinate(eval(input1Value))[0].outerHTML.replace(/></g, '>\n<'),
		mode: "text/html",
		readOnly: true
	})

	output1.autoFormat()


	input1.on('change', function(instance, changes) {

		output1.setValue(DOMinate(eval(instance.getValue()))[0].outerHTML.replace(/></g, '>\n<'))
		output1.autoFormat()
	})

	input2 = CodeMirror(document.getElementById("input2"), {
		value: "shaven(\n\t[document.body,\n\t\t[\'div#demo\',\n\t\t\t…\n\t\t]\n\t]\n)"
	})


	input3 = CodeMirror(document.getElementById("input3"), {
		value: "var element = shaven(\n\t[\'div#demo\',\n\t\t…\n\t]\n)\n\ndocument.body.appendChild(element[0])"
	})
	output3 = CodeMirror(document.getElementById("output3"), {
		value: "<body>\n\t<div id=demo>\n\t\t…\n\t</div>\n</body>",
		mode: "text/html"
	})


	input4 = CodeMirror(document.getElementById("input4"), {
		value: "['p#example', 'example text']"
	})
	output4 = CodeMirror(document.getElementById("output4"), {
		value: "<p id='example'>example text</p>",
		mode: "text/html"
	})

}()

