/*!
 * Linkifier Component
 * Copyright 2016 Pedro Ladaria <pedro.ladaria@gmail.com>
 * License: MIT
 */
const React = require('react');
const RE_CAPTURE_URLS = require('./regexp-capture-urls.js');
const RE_EMAIL_CHECK = require('./regexp-email-check.js');

const RE_HAS_SCHEME = /^\w+:/i;
const defaultScheme = 'http://';
const defaultKeyBase = 'linkifier';

const addSchemeIfNeeded = (url) => {
    if (RE_EMAIL_CHECK.test(url)) {
        return 'mailto:' + url;
    }
    if (RE_HAS_SCHEME.test(url)) {
        return url;
    }
    return defaultScheme + url;
};

export const linkifier = (text, props = {}, renderer = 'a') => {
    const result = [];
    const parts = text.split(RE_CAPTURE_URLS);
    let keyIndex = 0;
    const keyBase = props.key || defaultKeyBase;
    parts.forEach((part) => {
        if (!part) {
            return;
        }
        keyIndex++;
        const combinedProps = {...props};
        const key = keyBase + '-' + keyIndex;
        if (RE_CAPTURE_URLS.test(part)) {
            combinedProps.href = addSchemeIfNeeded(part);
            combinedProps.key = key;
            result.push(React.createElement(renderer, combinedProps, part));
        } else {
            result.push(React.createElement('span', {key: key}, part));
        }
    });
    return result;
};

const IGNORED_TYPES = {'a': 1, 'button': 1};

const Linkifier = React.createClass({

    keyIndex: 0,

    linkify(children, {target, key}) {
        const keyBase = key || defaultKeyBase;
        if (typeof children === 'string') {
            return linkifier(children, {target, key}, this.props.renderer);
        }
        if (Array.isArray(children)) {
            return children.map(child => this.linkify(child, {target, key}));
        }
        if (children && IGNORED_TYPES[children.type]) {
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
    },

    render() {
        this.keyIndex = 0;
        const {children, target, keyBase, wrap = 'span', renderer, ...props} = this.props;
        return React.createElement(wrap, props, ...this.linkify(React.Children.toArray(children), {target, key: keyBase}));
    },
})

export default Linkifier;
