const test = require('ava');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const linkifier = require('../src/linkifier').linkifier;
const Linkifier = require('../src/linkifier').default;
const split = require('../src/linkifier').split;

test('split strings', t => {

    const cases = [
        ['example.org', ['example.org']],
        ['https://www.example.org', ['https://www.example.org']],
        ['(https://www.example.org)', ['(', 'https://www.example.org', ')']],
        ['([https://www.example.org])', ['([', 'https://www.example.org', '])']],
        ['([_<https://www.example.org>_])', ['([_<', 'https://www.example.org', '>_])']],
        ['~https://www.example.org~', ['~', 'https://www.example.org', '~']],
        ['a\n\tb\tc\rd \t\r\ne', ['a', '\n\t', 'b', '\t', 'c', '\r', 'd', ' \t\r\n', 'e']],
    ];

    cases.forEach(([input, expected]) => {
        t.deepEqual(split(input), expected);
    });

});

test('linkifier function', t => {

    const cases = [
        [
            'Happy case',
            'http://www.domain.com/path/to/res?key1=val%201&key2=val2',
            undefined,
            '<div><a href="http://www.domain.com/path/to/res?key1=val%201&amp;key2=val2">http://www.domain.com/path/to/res?key1=val%201&amp;key2=val2</a></div>',
        ],
        [
            'Between braces',
            '<([https://example.org])>',
            undefined,
            '<div><span>&lt;([</span><a href="https://example.org">https://example.org</a><span>])&gt;</span></div>',
        ],
        [
            'Custom props',
            'https://example.org',
            {target: '_blank', className: 'my-class'},
            '<div><a target="_blank" class="my-class" href="https://example.org">https://example.org</a></div>',
            '<div class="my-class"><a target="_blank" href="https://example.org">https://example.org</a></div>',
        ],
        [
            'Protocol is automatically added',
            'example.org',
            undefined,
            '<div><a href="http://example.org">example.org</a></div>',
        ],
        [
            'Email',
            'name@example.org',
            undefined,
            '<div><a href=\"mailto:name@example.org\">name@example.org</a></div>',
        ],
        [
            'No slashes after protocol',
            'http:www.example.org',
            undefined,
            '<div><span>http:www.example.org</span></div>',
        ],
        [
            'Unneeded slashes after protocol',
            'http:///www.example.org',
            undefined,
            '<div><a href=\"http:///www.example.org\">http:///www.example.org</a></div>',
        ],
        [
            'IP',
            'ftp://123.234.1.99/path?var=val',
            undefined,
            '<div><a href=\"ftp://123.234.1.99/path?var=val\">ftp://123.234.1.99/path?var=val</a></div>',
        ],
        [
            'Url in query',
            'https://example.org?url=https://example.org',
            undefined,
            '<div><a href=\"https://example.org?url=https://example.org\">https://example.org?url=https://example.org</a></div>',
        ],
        [
            'Trailing slash',
            'https://example.org/',
            undefined,
            '<div><a href=\"https://example.org/">https://example.org/</a></div>',
        ],
    ];

    cases.forEach(([description, input, props, expected]) => {
        t.deepEqual(
            ReactDOMServer.renderToStaticMarkup(<div>{linkifier(input, props)}</div>),
            expected,
            description
        );
    });

    cases.forEach(([description, input, props, expected, expectedAsComponent]) => {
        expectedAsComponent = expectedAsComponent || expected;
        t.deepEqual(
            ReactDOMServer.renderToStaticMarkup(<Linkifier wrap="div" {...props}>{input}</Linkifier>),
            expectedAsComponent,
            description
        );
    });

});
/*
//'Anchors are left intact'

test('linkifier with url in query', t => {
    const url = 'http://www.domain.com/?url=http://www.domain.com';
    const expectedProps = {href: url, children: url};
    const result = linkifier(url);

    t.is(result.length, 1);
    t.is(result[0].type, 'a');
    t.is(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, expectedProps);
});

test('linkifier skips leading or trailing symbol', t => {
    const url = 'http://domain.com';
    const symbols = ['.', ',', '"', '(', ' ', "'", '?', '!', '%', '&', '*', '-', '@', '='];
    symbols.forEach(function (symbol) {
        const text = symbol + url + symbol;
        const expectedProps = {href: url, children: url};
        const result = linkifier(text);

        t.is(result.length, 3);
        t.is(result[0].type, 'span');
        t.is(result[1].type, 'a');
        t.is(result[2].type, 'span');

        t.is(result[0].key, 'linkifier-1');
        t.is(result[1].key, 'linkifier-2');
        t.is(result[2].key, 'linkifier-3');

        t.deepEqual(result[1].props, expectedProps);
    });
});

test('linkifier with custom key', t => {
    const url = 'http://www.domain.com';
    const text = ' some text';
    const input = url + text;
    const result = linkifier(input, {key: 'foo'});

    t.is(result.length, 2);

    t.is(result[0].type, 'a');
    t.is(result[0].key, 'foo-1');
    t.deepEqual(result[0].props, {href: url, children: url});

    t.is(result[1].type, 'span');
    t.is(result[1].key, 'foo-2');
    t.deepEqual(result[1].props, {children: text});
});

test('linkifier mail happy case', t => {
    const email = 'mailto:foo@bar.com';
    const result = linkifier(email);

    t.is(result.length, 1);

    t.is(result[0].type, 'a');
    t.is(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, {href: email, children: email});
});

test('linkifier mail without scheme', t => {
    const email = 'foo@bar.com';
    const expectedHref = 'mailto:' + email;
    const result = linkifier(email);

    t.is(result.length, 1);

    t.is(result[0].type, 'a');
    t.is(result[0].key, 'linkifier-1');
    t.deepEqual(result[0].props, {href: expectedHref, children: email});
});

test('jsx: styles and props are propagated', t => {
    const element =
        <Linkifier target="_blank" style={{display: 'block'}} id="0" className="1" otherProp="2" keyBase="3">
            http://my.site.org
        </Linkifier>;
    const expected =
        '<span style="display:block;" id="0" class="1">' +
            '<a target="_blank" href="http://my.site.org">http://my.site.org</a>' +
        '</span>';
    const result = ReactDomServer.renderToStaticMarkup(element);
    t.is(result, expected);
});

test('jsx: text inside <button> is not converted', t => {
    const element = <Linkifier><button>http://my.site.org</button></Linkifier>;
    const expected = '<span><button>http://my.site.org</button></span>';
    const result = ReactDomServer.renderToStaticMarkup(element);
    t.is(result, expected);
});

test('jsx: text inside <a> is not converted', t => {
    const element = <Linkifier><a href="http://my.site.org">http://my.site.org</a></Linkifier>;
    const expected = '<span><a href=\"http://my.site.org\">http://my.site.org</a></span>';
    const result = ReactDomServer.renderToStaticMarkup(element);
    t.is(result, expected);
});

test('jsx: various children', t => {
    const element =
        <Linkifier>
            <a href="http://my.site.org">http://my.site.org</a>
            {null}
            <span>pedro@ladaria.eu</span>
            {[<div key="1"/>, <span key="2"/>]}
            foo.bar
        </Linkifier>;
    const expected =
        '<span>' +
            '<a href=\"http://my.site.org\">http://my.site.org</a>' +
            '<span><a href=\"mailto:pedro@ladaria.eu\">pedro@ladaria.eu</a></span>' +
            '<div></div><span></span>' +
            '<a href="http://foo.bar">foo.bar</a>' +
        '</span>';
    const result = ReactDomServer.renderToStaticMarkup(element);
    t.is(result, expected);
});

test('README example - Component Simple', t => {
    const element = <Linkifier>check this: www.domain.com</Linkifier>;
    const expected = '<span><span>check this: </span><a href="http://www.domain.com">www.domain.com</a></span>';
    const result = ReactDomServer.renderToStaticMarkup(element);
    t.is(result, expected);
});

test('README example - Component Advanced', t => {
    const element =
        <Linkifier target="_blank" wrap="div" className="some-text">
            {'check this: www.domain.com'}
            <strong>send me a message: peter@domain.com</strong>
        </Linkifier>
    const result = ReactDomServer.renderToStaticMarkup(element);
    const expected =
        '<div class="some-text">' +
            '<span>check this: </span><a target=\"_blank\" href=\"http://www.domain.com\">www.domain.com</a>' +
            '<strong>' +
                '<span>send me a message: </span>' +
                '<a target=\"_blank\" href=\"mailto:peter@domain.com\">peter@domain.com</a>' +
            '</strong>' +
        '</div>';
    t.is(result, expected);
});

test('README example - Component with custom renderer', t => {
    const RedLink = ({href, children}) => (
        <a href={href} style={{color: 'red'}}>
            {children}
        </a>
    );

    const element =
        <Linkifier renderer={RedLink}>
            {'check this: www.domain.com'}
            <strong>send me a message: peter@domain.com</strong>
        </Linkifier>
    const result = ReactDomServer.renderToStaticMarkup(element);
    const expected =
        '<span>' +
            '<span>check this: </span><a href=\"http://www.domain.com\" style="color:red;">www.domain.com</a>' +
            '<strong>' +
                '<span>send me a message: </span>' +
                '<a href=\"mailto:peter@domain.com\" style="color:red;">peter@domain.com</a>' +
            '</strong>' +
        '</span>';
    t.is(result, expected);
});

test('README example - Function Simple', t => {
    const result = ReactDomServer.renderToStaticMarkup(<div>{linkifier('check this: www.domain.com')}</div>);
    const expected = '<div><span>check this: </span><a href="http://www.domain.com">www.domain.com</a></div>';
    t.is(result, expected);
});

test('README example - Function Advanced', t => {
    const result = ReactDomServer.renderToStaticMarkup(
        <div>
            {linkifier('check this www.domain.com', {target: '_blank', className: 'link'})}
        </div>
    );
    const expected =
        '<div>' +
            '<span>check this </span>' +
            '<a target=\"_blank\" class=\"link\" href=\"http://www.domain.com\">www.domain.com</a>' +
        '</div>';
    t.is(result, expected);
});

test('README example - Function with custom renderer', t => {
    const RedLink = ({href, children}) => (
        <a href={href} style={{color: 'red'}}>
            {children}
        </a>
    );

    const result = ReactDomServer.renderToStaticMarkup(
        <div>
            {linkifier('check this www.domain.com', {}, RedLink)}
        </div>
    );
    const expected =
        '<div>' +
            '<span>check this </span>' +
            '<a href=\"http://www.domain.com\" style="color:red;">www.domain.com</a>' +
        '</div>';
    t.is(result, expected);
});
*/
