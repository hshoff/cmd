var React = require('react');
var CMDTextInput = require('../../js/index');

var commands = ['c1','c2','c3'];

var users = [{
  displayName: 'nat',
  fullname: 'natalie'
},{
  displayName: 'bob',
  fullname: 'bob parr'
}];

var prefixTriggers = [{
  key: '/',
  data: commands
},{
  key: '@',
  data: users,

  text: function(user) {
    return '@'+user.displayName;
  },

  label: function(user) {
    return [
      '@'+user.displayName, user.fullname
    ].join(' ');
  },
}];

var Example = React.createClass({
  displayName: 'ExampleApp',
  render: function() {
    return (
      <CMDTextInput ref='cmd' prefixTriggers={prefixTriggers}>
        <input ref='composer'/>
      </CMDTextInput>
    );
  }
});

var el = document.getElementById('example-app');
React.render(<Example />, el);
