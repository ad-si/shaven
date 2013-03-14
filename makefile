all:
	uglifyjs2 --comments -v -c -m -o src/dominate.essential.min.js src/dominate.essential.js
	uglifyjs2 --comments -v -c -m -o src/dominate.min.js src/dominate.js
