all: test build site/index.html


build: source/library
	npx babel $< \
		--out-dir $@


site/index.html: source/templates/index.mustache \
	package.json site/scripts/bundle.js site/images
		npx --silent mustache package.json $< \
			> $@


site/images: source/images
	rm -rf $@
	cp -R $< $@


site/scripts/bundle.js shaven.js \
shaven.min.js shaven-server.min.js: source/library
	npx webpack


.PHONY: test
test: lint
	npx ava --fail-fast ./test/node.js ./test/jsdom.js


.PHONY: lint
lint:
	npx eslint \
		--max-warnings 0 \
		--ignore-path .gitignore \
		.


# Deploy website to surge.sh
.PHONY: deploy
deploy: site/index.html
	surge site shaven.ad-si.com


.PHONY: clean
clean:
	-rm -r ./build
	-rm -r ./node_modules
	-rm -r ./site
	-rm -r ./test/bundle/bundle.js
	-rm -r shaven*.js
