# react-linkifier [![Build Status](https://travis-ci.org/pladaria/react-linkifier.svg)](https://travis-ci.org/pladaria/react-linkifier)

Tiny React library to extract URLs from a string and convert them to clickable links.
It will return an array of React components (anchors for links and spans por regular text).

- Very small (~1KB minified and gzipped)
- Works great for complex URLs and handles many corner cases
- Allows custom props to be applied to &lt;a&gt; elements
- No dangerouslySetInnerHTML
- Automatically prepends `http://` to the href (or `mailto:` for emails)

## Install

```javascript
npm install --save react-linkifier
```

## Run tests

```javascript
// clone repo and then
npm install && npm test
```

## Basic usage

```javascript
import linkifier from 'react-linkifier';

const myComponent = () => (
    <div>
        {linkifier('check this http://www.domain.com!')}
    </div>
);
```

## Advanced usage

```javascript
import linkifier from 'react-linkifier';

const text = 'check this http://www.domain.com!';

const myComponent = () => (
    <div>
        {linkifier(text, {target: '_blank', key: 'k', className: 'link'})}
    </div>
);
```

## License

MIT
