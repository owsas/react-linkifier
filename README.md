# react-linkifier [![Build Status](https://travis-ci.org/pladaria/react-linkifier.svg)](https://travis-ci.org/pladaria/react-linkifier)

Tiny React library to extract URLs from a string and convert them to clickable links.
It will return an array of React components (anchors for links and spans por regular text).

- Very small (~1KB minified and gzipped)
- Use it as function or component
- Works great with complex URLs and handles many corner cases
- Allows custom props to be applied to &lt;a&gt; elements
- Automatically prepends `http://` to the href (or `mailto:` for emails)

## Install

```javascript
npm install --save react-linkifier
```

## Basic usage

### As component

```javascript
import Linkifier from 'react-linkifier';

const myComponent = () => (
    <Linkifier>
        check this: www.domain.com
    </Linkifier>
);
```

### As function

```javascript
import {linkifier} from 'react-linkifier';

const myComponent = () => (
    <div>
        {linkifier('check this: www.domain.com')}
    </div>
);
```

## Advanced usage

### As component

```javascript
import Linkifier from 'react-linkifier';

const myComponent = () => (
    <Linkifier target="_blank">
        {check this: www.domain.com}
        <strong>send me a message: peter@domain.com</strong>
    </Linkifier>
);
```

### As function

```javascript
import {linkifier} from 'react-linkifier';

const text = 'check this www.domain.com!';

const myComponent = () => (
    <div>
        {linkifier(text, {target: '_blank', key: 'k', className: 'link'})}
    </div>
);
```

## License

MIT
