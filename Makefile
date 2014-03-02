JS_FILES = $(shell find lib -name "*.js" ! -name ".\#*.js")
HTML_FILES = $(shell find lib -name "*.html" ! -name ".\#*.html")
JS_TEST_FILES = $(shell find test -name "*.test.js" ! -name ".\#*.js")

all: dist/calendar.js

dist/calendar.js: $(JS_FILES) $(HTML_FILES)
	@./node_modules/.bin/browserify -d -r ./index.js:calendar.js index.js > $@

test/build.js: $(JS_FILES) $(JS_TEST_FILES)
	@./node_modules/.bin/browserify -d -r ./index.js:calendar.js test/boot.test.js > $@

test: test/build.js
	@./node_modules/.bin/karma start

.PHONY: test
