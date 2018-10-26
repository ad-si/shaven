all: test build site/index.html


build: source/library
	yarn babel $< --out-dir $@


site/index.html: source/templates/index.mustache package.json site/scripts/bundle.js
	yarn --silent mustache package.json $< \
		> $@


site/scripts/bundle.js shaven.js \
shaven.min.js shaven-server.min.js: source/library
	yarn webpack


.PHONY: test
test: lint
	yarn ava --fail-fast ./test/node.js ./test/jsdom.js


.PHONY: lint
lint:
	yarn eslint \
		--max-warnings 0 \
		--ignore-path .gitignore \
		.


.PHONY: clean
clean:
	-rm -r ./site
	-rm -r ./build
	-rm -r ./test/bundle/bundle.js
	-rm -r shaven*.js
