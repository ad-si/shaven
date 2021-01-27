all: test site/index.html


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
	npm install


.PHONY: test
test: lint node_modules
	npx --no-install ava --fail-fast ./test/node.js ./test/jsdom.js


.PHONY: lint
lint: node_modules
	npx --no-install eslint \
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
