# CMD

Ever want to add `@mentions` and autocomplete to your text inputs?

`CMD` does that with arbitrary prefix triggers and with any data source.

![demo](http://cl.ly/image/0f0Z2j2b321z/cmd.gif)

Here's how the above works:

```js
componentDidMount: function() {
  this.refs.cmd.registerPrefixTrigger('/', {
    data: ['c1','c2','c3']
  });

  this.refs.cmd.registerPrefixTrigger('@', {
    // text is what is rendered in the input
    // when you select it (enter)
    text: function(user) {
      return ['@',user.displayName].join('');
    },

    // label is what is rendered in the
    // selection menu
    label: function(user) {
      return [
        '@'+user.displayName, user.fullname
      ].join(' ');
    },

    data: [{
      displayName: 'nat',
      fullname: 'natalie'
    },{
      displayName: 'bob',
      fullname: 'bob parr'
    }]
  });
},

render: function() {
  return (
    <CMDTextInput ref='cmd'>
      <input ref='composer' />
    </CMDTextInput>
  );
}
```

That's it.

## Getting started

  ```bash
  > git clone git@github.com:hshoff/cmd.git
  > npm install
  ```

## Examples

```bash
> npm run input
```
