/*!
 * Linkifier Component
 * Copyright 2016 Pedro Ladaria <pedro.ladaria@gmail.com>
 * License: MIT
 */
const React = require('react');
const RE_URL = require('./regexp-url.js');
const RE_EMAIL = require('./regexp-email.js');
const RE_HAS_SCHEME = /^\w+:/i;

const defaultScheme = 'http://';
const defaultKeyBase = 'l';

const addSchemeIfNeeded = (url) => {
    if (RE_EMAIL.test(url)) {
        return 'mailto:' + url;
    }
    if (RE_HAS_SCHEME.test(url)) {
        return url;
    }
    return defaultScheme + url;
};

const braces = '() [] {} <> ¿? ¡! «» “” ** __ ~~'.split(' ');

export const split = s => {

    const result = [];

    s.split(/(\s+)/).forEach(part => {
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

        sorry:
        while (length > (1 + depth) * 2) {
            const s = part[depth];
            const e = part[length - depth - 1];
            for (let i = 0; i < braces.length; i++) {
                if (s === braces[i][0] && e === braces[i][1]) {
                    open.push(braces[i][0]);
                    close.push(braces[i][1]);
                    depth++;
                    continue sorry;
                }
            }
            break;
        }

        if (depth) {
            result.push(open.join(''), part.substr(depth, length - depth * 2), close.reverse().join(''));
        } else {
            result.push(part);
        }
    });

    return result;
};

export const linkifier = (text, props = {}, renderer = 'a') => {
    const result = [];
    const parts = split(text);
    let keyIndex = 0;
    const keyBase = props.key || defaultKeyBase;
    parts.forEach((part) => {
        if (!part) {
            return;
        }
        keyIndex++;
        const combinedProps = {...props};
        const key = keyBase + '-' + keyIndex;
        if (RE_URL.test(part)) {
            combinedProps.href = addSchemeIfNeeded(part);
            combinedProps.key = key;
            result.push(React.createElement(renderer, combinedProps, part));
        } else {
            result.push(React.createElement('span', {key: key}, part));
        }
    });
    return result;
};

const IGNORED_TYPES = ['a', 'button'];

class Linkifier extends React.Component {

    constructor(props) {
        super(props);
        this.keyIndex = 0;
    }

    linkify(children, {target, key, renderer}) {
        const keyBase = key || defaultKeyBase;
        if (typeof children === 'string') {
            return linkifier(children, {target, key}, renderer);
        }
        if (Array.isArray(children)) {
            return children.map(child => this.linkify(child, {target, key}));
        }
        if (children && IGNORED_TYPES.indexOf[children.type] >= 0) {
            return children;
        }
        if (React.isValidElement(children)) {
            return React.cloneElement(
                children,
                {key: keyBase + '-' + (++this.keyIndex)},
                this.linkify(children.props.children, {target, key})
            );
        }
        return null;
    }

    render() {
        this.keyIndex = 0;
        const {children, target, keyBase, wrap = 'span', renderer, ...props} = this.props;
        return React.createElement(wrap, props, ...this.linkify(React.Children.toArray(children), {target, key: keyBase, renderer}));
    }
}

export default Linkifier;
