!function () {

	var input1,
		output1,
		input2,
		input3,
		output3,
		input4,
		output4,
		inputs = [],
		outputs = [],
		inputValues = [
			"[\'div#demo\',\n\t[\'h1#logo\', \'Static Example\', {style: \'color:blue\'}],\n\t[\'p\', \'some example text\'],\n\t[\'ul#list.bullets\',\n\t\t[\'li\', \'item1\'],\n\t\t[\'li.active\', \'item2\'],\n\t\t[\'li\',\n\t\t\t[\'a\', \'item3\', {href: \'#\'}]\n\t\t]\n\t]\n]",
			"shaven(\n\t[document.body,\n\t\t[\'div#demo\',\n\t\t\t…\n\t\t]\n\t]\n)",
			"var shavenObject = shaven(\n\t[\'div#demo\',\n\t\t…\n\t]\n)\n\ndocument.body.appendChild(shavenObject[0])",
			"['p#example', 'example text']",
			"['p.info', 'example text']"
		],
		outputValues = [
			null,
			null,
			"<body>\n    <div id=\"demo\">\n        …\n    </div>\n</body>"
		]

	CodeMirror.defaults.theme = "twilight"
	CodeMirror.defaults.indentWithTabs = true
	CodeMirror.defaults.indentUnit = 4

	CodeMirror.defineExtension("autoFormat", function () {

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

		for (i = 0; i < text.length; ++i) {

			stream = new CodeMirror.StringStream(text[i], tabSize)

			while (!stream.eol()) {

				inner = CodeMirror.innerMode(outer, state)
				style = outer.token(stream, state)
				cur = stream.current()

				stream.start = stream.pos

				if (!atSol || /\S/.test(cur)) {
					out += cur
					atSol = false
				}

				if (!atSol && inner.mode.newlineAfterToken &&
					inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i + 1] || "", inner.state))
					newline()
			}

			if (!stream.pos && outer.blankLine)
				outer.blankLine(state)

			if (!atSol) newline()
		}

		cm.operation(function () {

			cm.replaceRange(out, from, to)

			for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
				cm.indentLine(cur, "smart")

			//cm.setSelection(from, cm.getCursor(false))
		})
	})

	inputs[0] = CodeMirror(document.getElementById("input0"), {
		value: inputValues[0]
	})

	inputs[0].on('change', function (instance) {

		try {
			outputs[0].setValue(DOMinate(eval(instance.getValue()))[0].outerHTML.replace(/></g, '>\n<'))
			outputs[0].autoFormat()
		}
		catch (error) {
			outputs[0].setValue(error.message)
		}
	})


	outputs[0] = CodeMirror(document.getElementById("output0"), {
		value: DOMinate(eval(inputValues[0]))[0].outerHTML.replace(/></g, '>\n<'),
		mode: "text/html",
		readOnly: true
	})
	outputs[0].autoFormat()


	inputs[1] = CodeMirror(document.getElementById("input1"), {
		value: inputValues[1],
		readOnly: true
	})
	inputs[2] = CodeMirror(document.getElementById("input2"), {
		value: inputValues[2],
		readOnly: true
	})
	outputs[2] = CodeMirror(document.getElementById("output2"), {
		value: outputValues[2],
		mode: "text/html",
		readOnly: true
	})


	inputs[3] = CodeMirror(document.getElementById("input3"), {
		value: inputValues[3]
	})
	outputs[3] = CodeMirror(document.getElementById("output3"), {
		value: DOMinate(eval(inputValues[3]))[0].outerHTML.replace(/></g, '>\n<'),
		mode: "text/html"
	})


	inputs[4] = CodeMirror(document.getElementById("input4"), {
		value: inputValues[4]
	})
	outputs[4] = CodeMirror(document.getElementById("output4"), {
		value: DOMinate(eval(inputValues[4]))[0].outerHTML.replace(/></g, '>\n<'),
		mode: "text/html"
	})


	$('.code').css('max-height', '500px')

}()

