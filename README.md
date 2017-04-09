<p align="center">
    <img src="http://cdn.jsdelivr.net/emojione/assets/svg/2693.svg" width=250 />
    <h1 align="center">react-linkifier</h1>
    <p align="center">Tiny React library to create links from text</p>
    <p align="center"><a href="https://travis-ci.org/pladaria/react-linkifier"><img src="https://travis-ci.org/pladaria/react-linkifier.svg"></p></a>
</p>

## Features

- Very small (~2KB minified and gzipped)
- Use it as function or component
- Works great with complex URLs and handles many corner cases
- Allows custom props to be applied to &lt;a&gt; elements
- Automatically prepends `http://` to the href or `mailto:` for emails

## Live demo

[Demo](https://runkit.com/pladaria/react-linkifier-demo)

## Install

```javascript
npm install --save react-linkifier
```

## Basic usage

### As component

```javascript
import Linkifier from 'react-linkifier';

const MyComponent = () => (
    <Linkifier>
        <div>check this: www.example.org</div>
    </Linkifier>
);

// Render result:
// <div>
//     <span>check this: </span><a href="http://www.example.org">www.example.org</a>
// </div>
```

### As function

```javascript
import {linkifier} from 'react-linkifier';

const MyComponent = () => (
    <div>
        {linkifier('www.example.org')}
    </div>
);

// Render result:
// <div>
//     <a href=\"http://www.example.org\">www.example.org</a>
// </div>
```

## Advanced usage

### As component

`className` and other props are assigned to the link elements.

```javascript
import Linkifier from 'react-linkifier';

const MyComponent = () => (
    <Linkifier target="_blank" className="my-class">
        <div>www.example.org</div>
    </Linkifier>
);

// Render result:
// <div><a target=\"_blank\" class=\"my-class\" href=\"http://www.example.org\">www.example.org</a></div>
```

#### With custom renderer
If you want to change the way `<Linkifier />` renders links, for example when you want to use a custom component instead of `<a>`, you can use the `renderer` prop:

```javascript
import Linkifier from 'react-linkifier';

const RedLink = ({href, children}) => (
    <a href={href} style={{color: 'red'}}>
        {children}
    </a>
);

const MyComponent = () => (
    <Linkifier renderer={RedLink}>
        <div>www.example.org</div>
    </Linkifier>
);

// Render result:
// <div>
//     <a href=\"http://www.example.org\" style=\"color:red;\">www.example.org</a>
// </div>
```

### As function

```javascript
import {linkifier} from 'react-linkifier';

const text = 'check this: www.example.org';

const MyComponent = () => (
    <div>
        {linkifier(text, {target: '_blank', className: 'link'})}
    </div>
);

// Render result:
// <div>
//     <span>check this: </span>
//     <a target="_blank" class="link" href="http://www.example.org">www.example.org</a>
// </div>
```

#### With custom renderer

When using ``linkifier`` as a function you can also pass a custom renderer:

```javascript
import {linkifier} from 'react-linkifier';

const RedLink = ({href, children}) => (
    <a href={href} style={{color: 'red'}}>
        {children}
    </a>
);

const text = 'check this: www.example.org';

const MyComponent = () => (
    <div>
        {linkifier(text, {renderer: RedLink})}
    </div>
);

// Render result:
// <div>
//     <span>check this: </span>
//     <a href="http://www.example.org" style="color:red;">www.example.org</a>
// </div>
```

## Options

- `protocol`: this protocol will be used if the protocol part is missing
- `renderer`: pass a component to use a custom link renderer, defaults to `a`.
- Rest of properties of the options object (eg: `style`, `className`) or props of the `Linkifier` component are passed as props to the link element

## License

MIT

## Credits

Artwork by [emojione.com](emojione.com)
