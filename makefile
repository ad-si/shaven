.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: build
build: compile site/index.html


site/index.html: source/templates/index.mustache \
	package.json site/scripts/bundle.js site/images node_modules
		npx --no-install --silent mustache package.json $< \
			> $@


site/images: source/images
	rm -rf $@
	cp -R $< $@


site/scripts/bundle.js build/shaven.js: source node_modules
	npx --no-install webpack


.PHONY: compile
compile: node_modules
	npx --no-install tsc -p tsconfig.build.json


node_modules: package.json package-lock.json
	if test ! -d $@; then npm install --force; fi


.PHONY: test
test: typecheck lint node_modules
	npx --no-install ava --fail-fast ./test/node.ts ./test/jsdom.ts


.PHONY: typecheck
typecheck: node_modules
	npx --no-install tsc


.PHONY: lint
lint: node_modules
	npx --no-install oxlint --deny-warnings


.PHONY: format
format: node_modules
	npx --no-install oxlint --fix


.PHONY: clean
clean:
	-rm -r ./build
	-rm -r ./node_modules
	-rm -r ./site
	-rm -r ./test/bundle/bundle.js
