var React = require('react');
var RE_URL_VALIDATION = require('./regexp-url-validation.js');

var defaultScheme = 'http://';
var defaultKeyBase = 'linkifier';

var addSchemeIfNeeded = function (url) {
    if ((/^\w+:/i).test(url)) {
        return url;
    }
    return defaultScheme + url;
};

var linkifier = function (text, props) {
    var props = props || {};
    var result = [];
    var parts = text.split(RE_URL_VALIDATION);
    var keyIndex = 0;
    var keyBase = (props.key) || defaultKeyBase;
    parts.forEach(function (text) {
        if (!text) {
            return;
        }
        keyIndex++;
        var combinedProps = props;
        var key = keyBase + '-' + keyIndex;
        if (RE_URL_VALIDATION.test(text)) {
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
