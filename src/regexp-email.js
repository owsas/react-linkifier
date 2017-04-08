/**
 * Naive checking
 */
module.exports = new RegExp(
    '^' +
    '([a-z\\u00a1-\\uffff0-9\\-\\.\\+])+' +
    '@' +
    '([a-z\\u00a1-\\uffff0-9\\-\\.])+' +
    '$', 'i'
);
