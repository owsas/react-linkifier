/*!
 * Linkifier Component
 * Copyright 2016 Pedro Ladaria <pedro.ladaria@gmail.com>
 * License: MIT
 */
const React = require('react');
const RE_URL = require('./regexp-url.js');
const RE_EMAIL = require('./regexp-email.js');
const RE_HAS_SCHEME = /^\w+:/i;

const DEFAULT_PROTOCOL = 'http';

const getKey = n => 'l' + n;

const addProtocolIfNeeded = (url, protocol = DEFAULT_PROTOCOL) => {
    if (RE_EMAIL.test(url)) {
        return 'mailto:' + url;
    }
    if (RE_HAS_SCHEME.test(url)) {
        return url;
    }
    return protocol + '://' + url;
};

const braces = '() [] {} <> ¿? ¡! «» “” ** __ ~~ "" \'\' ``'.split(' ');

const RE_SPLIT = /(\s+|[.,;:]\s|[.,;:]$)/;

export const split = s => {

    const result = [];

    s.split(RE_SPLIT).forEach(part => {
        if (!part) {
            return;
        }
        if (part.length < 3 || (/[a-zA-Z0-9]/).test(part[0])) {
            result.push(part);
            return;
        }

        let depth = 0;
        const length = part.length;
        const open = [];
        const close = [];

        while (length > (1 + depth) * 2) {
            const s = part[depth];
            const e = part[length - depth - 1];
            let i;
            for (i = 0; i < braces.length; i++) {
                if (s === braces[i][0] && e === braces[i][1]) {
                    open.push(braces[i][0]);
                    close.push(braces[i][1]);
                    depth++;
                    break;
                }
            }
            if (i >= braces.length) {
                break;
            }
        }

        if (depth) {
            result.push(open.join(''), part.substr(depth, length - depth * 2), close.reverse().join(''));
        } else {
            result.push(part);
        }
    });

    return result;
};

export const linkifier = (text, {renderer = 'a', protocol, ...props} = {}) => {
    const result = [];
    const parts = split(text);
    let acc = [];
    let key = 0;
    const pushAccumulated = () => {
        if (acc.length) {
            result.push(React.createElement('span', {key: getKey(key++)}, acc.join('')));
        }
        acc = [];
    }

    parts.forEach((part) => {
        if (!part) {
            return;
        }
        if (RE_URL.test(part)) {
            pushAccumulated();
            props.href = addProtocolIfNeeded(part, protocol);
            props.key = getKey(key++);
            result.push(React.createElement(renderer, props, part));
        } else {
            acc.push(part);
        }
    });
    pushAccumulated();
    return result;
};

const IGNORED_TYPES = ['a', 'button'];

class Linkifier extends React.Component {

    constructor(props) {
        super(props);
        this.keyIndex = 0;
    }

    linkify(node, props) {
        if (typeof node === 'string') {
            return linkifier(node, props);
        }
        if (Array.isArray(node)) {
            return node.map(n => this.linkify(n, props));
        }
        if (node && IGNORED_TYPES.indexOf(node.type) >= 0) {
            return node;
        }
        if (React.isValidElement(node)) {
            return React.cloneElement(
                node,
                {key: getKey(++this.keyIndex)},
                this.linkify(node.props.children, props)
            );
        }
        return node;
    }

    render() {
        const {children, ...props} = this.props;
        if (React.Children.count(children) === 0) {
            return null;
        }

        const result = this.linkify(React.Children.toArray(children), props);

        if (result.length === 1 && React.isValidElement(result[0])) {
            return result[0];
        }
        return React.createElement('span', {}, ...result);
    }
}

export default Linkifier;
