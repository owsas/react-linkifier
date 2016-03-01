var test = require('tape');
var linkifier = require('../src/linkifier.js');

test('linkifier happy case', function (t) {
    var url = 'http://www.domain.com/path/to/resource?key1=val%201&key2=val2';
    var expectedProps = {href: url, children: url};
    var result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with custom props', function (t) {
    var url = 'http://www.domain.com';
    var props = {target: '_blank', className: 'my-class'};
    var expectedProps = Object.assign({href: url, children: url}, props);
    var result = linkifier(url, props);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier without scheme adds http:// to href', function (t) {
    var url = 'domain.com';
    var expectedProps = {href: 'http://' + url, children: url};
    var result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier without slashes after scheme', function (t) {
    var url = 'http:www.domain.com';
    var expectedProps = {href: url, children: url};
    var result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with one slash after scheme', function (t) {
    var url = 'http:/www.domain.com';
    var expectedProps = {href: url, children: url};
    var result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with any number of slashes after scheme', function (t) {
    var url = 'http://///////www.domain.com';
    var expectedProps = {href: url, children: url};
    var result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with url in query', function (t) {
    var url = 'http://www.domain.com/?url=http://www.domain.com';
    var expectedProps = {href: url, children: url};
    var result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier skips leading or trailing symbol', function (t) {
    var url = 'http://domain.com';
    var symbols = ['.', ',', '"', '(', ' ', "'", '?', '!', '%', '&', '*', '-', '@', '='];
    symbols.forEach(function (symbol) {
        var text = symbol + url + symbol;
        var expectedProps = {href: url, children: url};
        var result = linkifier(text);

        t.equal(result.length, 3);
        t.equal(result[0].type, 'span');
        t.equal(result[1].type, 'a');
        t.equal(result[2].type, 'span');

        t.equal(result[0].key, 'linkifier-1');
        t.equal(result[1].key, 'linkifier-2');
        t.equal(result[2].key, 'linkifier-3');

        t.deepEqual(result[1].props, expectedProps);
    });
    t.end();
});

test('linkifier with custom key', function (t) {
    var url = 'http://www.domain.com';
    var text = ' some text';
    var input = url + text;
    var result = linkifier(input, {key: 'foo'});

    t.equal(result.length, 2);

    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'foo-1');
    t.deepEqual(result[0].props, {href: url, children: url});

    t.equal(result[1].type, 'span');
    t.equal(result[1].key, 'foo-2');
    t.deepEqual(result[1].props, {children: text});
    t.end();
});
