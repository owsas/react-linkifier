const test = require('tape');
const linkifier = require('../dist/linkifier').linkifier;
const Linkifier = require('../dist/linkifier').default;
const React = require('react');
const ReactDomServer = require('react-dom/server');

test('linkifier happy case', t => {
    const url = 'http://www.domain.com/path/to/resource?key1=val%201&key2=val2';
    const expectedProps = {href: url, children: url};
    const result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with custom props', t => {
    const url = 'http://www.domain.com';
    const props = {target: '_blank', className: 'my-class'};
    const expectedProps = Object.assign({href: url, children: url}, props);
    const result = linkifier(url, props);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier without scheme adds http:// to href', t => {
    const url = 'domain.com';
    const expectedProps = {href: 'http://' + url, children: url};
    const result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier without slashes after scheme', t => {
    const url = 'http:www.domain.com';
    const expectedProps = {href: url, children: url};
    const result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with one slash after scheme', t => {
    const url = 'http:/www.domain.com';
    const expectedProps = {href: url, children: url};
    const result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with any number of slashes after scheme', t => {
    const url = 'http://///////www.domain.com';
    const expectedProps = {href: url, children: url};
    const result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier with url in query', t => {
    const url = 'http://www.domain.com/?url=http://www.domain.com';
    const expectedProps = {href: url, children: url};
    const result = linkifier(url);

    t.equal(result.length, 1);
    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
    t.end();
});

test('linkifier skips leading or trailing symbol', t => {
    const url = 'http://domain.com';
    const symbols = ['.', ',', '"', '(', ' ', "'", '?', '!', '%', '&', '*', '-', '@', '='];
    symbols.forEach(function (symbol) {
        const text = symbol + url + symbol;
        const expectedProps = {href: url, children: url};
        const result = linkifier(text);

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

test('linkifier with custom key', t => {
    const url = 'http://www.domain.com';
    const text = ' some text';
    const input = url + text;
    const result = linkifier(input, {key: 'foo'});

    t.equal(result.length, 2);

    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'foo-1');
    t.deepEqual(result[0].props, {href: url, children: url});

    t.equal(result[1].type, 'span');
    t.equal(result[1].key, 'foo-2');
    t.deepEqual(result[1].props, {children: text});
    t.end();
});

test('linkifier mail happy case', t => {
    const email = 'mailto:foo@bar.com';
    const result = linkifier(email);

    t.equal(result.length, 1);

    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, {href: email, children: email});
    t.end();
});

test('linkifier mail without scheme', t => {
    const email = 'foo@bar.com';
    const expectedHref = 'mailto:' + email;
    const result = linkifier(email);

    t.equal(result.length, 1);

    t.equal(result[0].type, 'a');
    t.equal(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, {href: expectedHref, children: email});
    t.end();
});

test.only('Linkifier component', t => {
    const element = React.createElement(
        Linkifier,
        null,
        React.createElement(
            "div",
            null,
            "foo@bar.baz",
            React.createElement(
                "a",
                {href: "url"},
                "www.ignored.com"
            ),
            React.createElement(
                "button",
                null,
                "www.ignored.com"
            ),
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    null,
                    "foo.bar"
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "div",
                        null,
                        "http://www.foo.bar"
                    )
                )
            )
        )
    );
    console.log(ReactDomServer.renderToStaticMarkup(element));
    t.end();
});
