var React = require('react');
var RE_CAPTURE_URLS = require('./regexp-capture-urls.js');
var RE_EMAIL_CHECK = require('./regexp-email-check.js');
var RE_HAS_SCHEME = /^\w+:/i;

var defaultScheme = 'http://';
var defaultKeyBase = 'linkifier';

var addSchemeIfNeeded = function (url) {
    if (RE_EMAIL_CHECK.test(url)) {
        return 'mailto:' + url;
    }
    if (RE_HAS_SCHEME.test(url)) {
        return url;
    }
    return defaultScheme + url;
};

var linkifier = function (text, props) {
    var props = props || {};
    var result = [];
    var parts = text.split(RE_CAPTURE_URLS);
    var keyIndex = 0;
    var keyBase = (props.key) || defaultKeyBase;
    parts.forEach(function (text) {
        if (!text) {
            return;
        }
        keyIndex++;
        var combinedProps = props;
        var key = keyBase + '-' + keyIndex;
        if (RE_CAPTURE_URLS.test(text)) {
            combinedProps.href = addSchemeIfNeeded(text);
            combinedProps.key = key;
            result.push(React.createElement('a', combinedProps, text));
        } else {
            result.push(React.createElement('span', {key: key}, text));
        }
    });
    return result;
};

module.exports = linkifier;
