var React = require('react');
var CMDTextInput = require('../../js/index');

var Example = React.createClass({
  displayName: 'ExampleApp',

  componentDidMount: function() {
    this.refs.cmd.registerPrefixTrigger('/', {
      data: ['c1','c2','c3']
    });

    this.refs.cmd.registerPrefixTrigger('@', {
      text: function(user) {
        return ['@',user.displayName].join('');
      },
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
});

var el = document.getElementById('example-app');
React.render(<Example />, el);
