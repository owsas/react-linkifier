const test = require('ava');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const linkifier = require('../src/linkifier').linkifier;
const Linkifier = require('../src/linkifier').default;
const split = require('../src/linkifier').split;

const RedLink = ({href, children}) => <a href={href} style={{color: 'red'}}>{children}</a>;

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
            'http://www.example.org/path/to/res?key1=val%201&key2=val2',
            undefined,
            '<a href="http://www.example.org/path/to/res?key1=val%201&amp;key2=val2">http://www.example.org/path/to/res?key1=val%201&amp;key2=val2</a>',
        ],
        [
            'Between braces',
            '<([https://example.org])>',
            undefined,
            '<span>&lt;([</span><a href="https://example.org">https://example.org</a><span>])&gt;</span>',
        ],
        [
            'Custom props',
            'https://example.org',
            {target: '_blank', className: 'my-class'},
            '<a target="_blank" class="my-class" href="https://example.org">https://example.org</a>',
        ],
        [
            'Protocol is automatically added',
            'example.org',
            undefined,
            '<a href="http://example.org">example.org</a>',
        ],
        [
            'Protocol is automatically added to emails, only if needed',
            'user@example.org mailto:user@example.org',
            undefined,
            '<a href="mailto:user@example.org">user@example.org</a><span> </span><a href="mailto:user@example.org">mailto:user@example.org</a>',
        ],
        [
            'Custom protocol',
            'example.org',
            {protocol: 'ftp'},
            '<a href="ftp://example.org">example.org</a>',
        ],
        [
            'Custom renderer',
            'example.org',
            {renderer: RedLink},
            '<a href="http://example.org" style="color:red">example.org</a>',
        ],
        [
            'Email',
            'name@example.org',
            undefined,
            '<a href="mailto:name@example.org">name@example.org</a>',
        ],
        [
            'No slashes after protocol',
            'http:www.example.org',
            undefined,
            '<span>http:www.example.org</span>',
        ],
        [
            'Unneeded slashes after protocol',
            'http:///www.example.org',
            undefined,
            '<a href="http:///www.example.org">http:///www.example.org</a>',
        ],
        [
            'IP',
            'ftp://123.234.1.99/path?var=val',
            undefined,
            '<a href="ftp://123.234.1.99/path?var=val">ftp://123.234.1.99/path?var=val</a>',
        ],
        [
            'URL in querystring',
            'https://example.org?url=https://example.org',
            undefined,
            '<a href="https://example.org?url=https://example.org">https://example.org?url=https://example.org</a>',
        ],
        [
            'Trailing slash',
            'https://example.org/',
            undefined,
            '<a href="https://example.org/">https://example.org/</a>',
        ],
        [
            'Trailing punctuation marks not included in urls if followed by space or end',
            'https://example.org, https://example.org.',
            undefined,
            '<a href="https://example.org">https://example.org</a><span>, </span><a href="https://example.org">https://example.org</a><span>.</span>',
        ],
        [
            'URLs with colons',
            'https://example.org/?a=this:contains:colons',
            undefined,
            '<a href="https://example.org/?a=this:contains:colons">https://example.org/?a=this:contains:colons</a>',
        ],
    ];

    cases.forEach(([description, input, props, expected]) => {
        t.deepEqual(
            ReactDOMServer.renderToStaticMarkup(linkifier(input, props)),
            expected,
            description
        );
    });

});

test('Linkifier component', t => {

    const cases = [
        [
            'No children',
            null,
            {},
            '',
        ],
        [
            'No children',
            undefined,
            {},
            '',
        ],
        [
            'Numeric child',
            123,
            {},
            '123',
        ],
        [
            'Not wrapped if not needed',
            <span>http://example.org</span>,
            {},
            '<span><a href="http://example.org">http://example.org</a></span>',
        ],
        [
            'Anchors and buttons are left intact',
            <span><a href="http://example.org">http://example.org</a><button>http://example.org</button></span>,
            {},
            '<span><a href="http://example.org">http://example.org</a><button>http://example.org</button></span>',
        ],
        [
            'className and props are assigned to link elements',
            <span>example.org</span>,
            {className: 'my-class', target: '_blank', protocol: 'file'},
            '<span><a class="my-class" target="_blank" href="file://example.org">example.org</a></span>',
        ],
        [
            'className and props are assigned to link elements',
            '<span>http://example.org</span>',
            {},
            '<span>&lt;span&gt;http://example.org&lt;/span&gt;</span>',
        ],
        [
            'Custom renderer',
            <span>http://example.org</span>,
            {renderer: RedLink},
            '<span><a href="http://example.org" style="color:red">http://example.org</a></span>',
        ],
        [
            'README example - Simple component',
            <div>check this: www.example.org</div>,
            {},
            '<div><span>check this: </span><a href="http://www.example.org">www.example.org</a></div>',
        ],
        [
            'README example - Simple function',
            <div>{linkifier('www.example.org')}</div>,
            {},
            '<div><a href="http://www.example.org">www.example.org</a></div>',
        ],
        [
            'README example - Advanced component',
            <div>www.example.org</div>,
            {target: '_blank', className: 'my-class'},
            '<div><a target="_blank" class="my-class" href="http://www.example.org">www.example.org</a></div>',
        ],
        [
            'README example - Advanced component with custom renderer',
            <div>www.example.org</div>,
            {renderer: RedLink},
            '<div><a href="http://www.example.org" style="color:red">www.example.org</a></div>',
        ],
        [
            'README example - ignore',
            <div>
                <pre>
                    http://example.org
                </pre>
                <a href="http://example.org">example</a>
                <button>http://example.org</button>
            </div>,
            {ignore: [...Linkifier.DEFAULT_IGNORED, 'pre']},
            '<div><pre>http://example.org</pre><a href="http://example.org">example</a><button>http://example.org</button></div>',
        ],
    ];

    cases.forEach(([description, input, props, expected]) => {
        t.deepEqual(
            ReactDOMServer.renderToStaticMarkup(<Linkifier {...props}>{input}</Linkifier>),
            expected,
            description
        );
    });

});
