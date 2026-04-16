.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: build
build: site/index.html


site/index.html: source/templates/index.mustache \
	package.json site/scripts/bundle.js site/images node_modules
		npx --no-install --silent mustache package.json $< \
			> $@


site/images: source/images
	rm -rf $@
	cp -R $< $@


site/scripts/bundle.js shaven.js \
shaven.min.js shaven-server.min.js: source/library node_modules
	npx --no-install webpack


node_modules: package.json package-lock.json
	if test ! -d $@; then npm install --force; fi


.PHONY: test
test: lint node_modules
	npx --no-install ava --fail-fast ./test/node.js ./test/jsdom.js


.PHONY: lint
lint: node_modules
	npx --no-install eslint \
		--max-warnings 0 \
		--ignore-path .gitignore \
		.


.PHONY: format
format: node_modules
	npx --no-install eslint \
		--fix \
		--ignore-path .gitignore \
		.


.PHONY: clean
clean:
	-rm -r ./build
	-rm -r ./node_modules
	-rm -r ./site
	-rm -r ./test/bundle/bundle.js
