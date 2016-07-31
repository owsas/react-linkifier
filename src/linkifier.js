import React from 'react';
import RE_CAPTURE_URLS from './regexp-capture-urls.js';
import RE_EMAIL_CHECK from './regexp-email-check.js';

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

export const linkifier = (text, props = {}) => {
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
            result.push(React.createElement('a', combinedProps, part));
        } else {
            result.push(React.createElement('span', {key: key}, part));
        }
    });
    return result;
};

const IGNORED_TYPES = {'a': 1, 'button': 1};

const Linkifier = React.createClass({

    keyIndex: 0,

    linkify(children) {
        if (typeof children === 'string') {
            return linkifier(children);
        }
        if (IGNORED_TYPES[children.type]) {
            return children;
        }
        if (React.isValidElement(children)) {
            return React.cloneElement(
                children,
                {key: defaultKeyBase + '-' + (++this.keyIndex)},
                this.linkify(children.props.children)
            );
        }
        if (children instanceof Array) {
            return children.map(this.linkify);
        }
        return null;
    },

    render() {
        this.keyIndex = 0;
        const {children, ...props} = this.props;
        return React.createElement('span', props, ...this.linkify(React.Children.toArray(children)));
    },
})

export default Linkifier;
