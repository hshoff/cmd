var _ = require('underscore');
var React = require('react');

var CMDSelectionMenu = React.createClass({
  displayName: 'CMDSelectionMenu',

  getDefaultProps: function() {
    return {
      showSelectionMenu: false,
      prefix: '',
      data: []
    }
  },

  renderItems: function(item, idx) {
    var prefix = this.props.prefix;
    var label = (prefix && _.isObject(item)) ? prefix.label(item) : item;
    var bgColor = (idx === this.props.selectedIndex) ? 'blue' : 'transparent';
    var itemStyle = {
      padding: 3,
      backgroundColor: bgColor
    };

    return (
      <li key={idx} style={itemStyle}>
        {label}
      </li>
    );
  },

  render: function() {
    var styles = {
      position: 'absolute',
      top: 20,
      width: '100%',
      padding: 0,
      margin: 0,
      backgroundColor: 'yellow',
      display: this.props.showSelectionMenu ? 'block' : 'none'
    };

    var Items = _.map(this.props.data, this.renderItems, this);

    return (
      <ul style={styles}>
        {Items}
      </ul>
    );
  }
});


var CMDTextInput = React.createClass({
  displayName: 'CMDTextInput',

  propTypes: {
    prefixTriggers: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      prefixTriggers: []
    }
  },

  getInitialState: function() {
    return {
      options: {},
      foundPrefix: null,
      selectedIndex: -1,
      showSelectionMenu: false
    }
  },

  componentWillMount: function() {
    var composer = this.getComposer();

    // don't clobber existing events
    this.addBeforeFn('onKeyPress', composer.props);
    this.addBeforeFn('onKeyUp', composer.props);
  },

  componentDidMount: function() {
    this.props.prefixTriggers.forEach(function(trigger){
      this.registerPrefixTrigger(trigger.key, trigger)
    }, this);
  },

  registerPrefixTrigger: function(prefix, data) {
    var options = this.state.options;
    options[prefix] = data;
    this.setState({options: options});
  },

  getComposer: function() {
    var c = this.props.children;
    var children = _.isArray(c) ? c : [c];
    return _.findWhere(children, {
      ref: 'composer'
    });
  },

  addBeforeFn: function(eventName, target) {
    fn = target[eventName] || function(){};
    target[eventName] = function(event) {
      this[eventName].call(this, event);
      fn.call(null, event);
    }.bind(this);
  },

  reset: function() {
    this.setState({
      foundPrefix: null,
      showSelectionMenu: false,
      selectedIndex: -1
    });
  },

  onKeyUp: function(e) {
    e.preventDefault();
    var keyCode = e.keyCode;
    var value = event.target.value;
    var prefixIndex = value.indexOf(this.state.foundPrefix);

    // user deleted the found prefix
    if (prefixIndex < 0) this.reset();

    switch (keyCode) {
      // enter
      case 13:
        var selectedIndex = this.state.selectedIndex;
        var foundPrefix = this.state.foundPrefix;
        var prefix = this.state.options[foundPrefix];
        var data = prefix.data;
        var newValue = '';

        if (selectedIndex > -1) {
          var selection = data[selectedIndex];
          selection = _.isObject(selection) ? prefix.text(selection) : selection;
          newValue = [value.split(foundPrefix)[0], selection].join('');
        } else {
          newValue = '';
        }

        e.target.value = newValue;
        this.reset();
        break;

      // backspace
      case 8:
        if (value.length <= 2) {
          this.reset();
        }
        break;

      // esc
      case 27:
        this.reset();
        break;

      // down arrow
      case 40:
        if (!this.state.showSelectionMenu) return;
        this.setState({
          selectedIndex: this.increaseSelectedIndex()
        });
        break;

      // up arrow
      case 38:
        if (!this.state.showSelectionMenu) return;
        this.setState({
          selectedIndex: this.decreaseSelectedIndex()
        });
        break;
    }
  },

  increaseSelectedIndex: function() {
    var prefix = this.state.foundPrefix;
    var data = this.state.options[prefix].data;
    var selectedIndex = this.state.selectedIndex;
    return selectedIndex+1 >= data.length ? 0 : selectedIndex+1;
  },

  decreaseSelectedIndex: function() {
    var prefix = this.state.foundPrefix;
    var data = this.state.options[prefix].data;
    var selectedIndex = this.state.selectedIndex;
    return selectedIndex-1 < 0 ? data.length-1 : selectedIndex-1;
  },

  onKeyPress: function(e) {
    var value = event.target.value;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;

    // already matched on prefix trigger
    if (this.state.foundPrefix) return;

    switch (charCode) {
      // foward slash
      case 47:
        this.setState({
          foundPrefix: '/',
          showSelectionMenu: true
        });
        break;

      // @
      case 64:
        this.setState({
          foundPrefix: '@',
          showSelectionMenu: true
        });
        break;
    }
  },

  render: function() {
    var foundPrefix = this.state.foundPrefix;
    var prefix = this.state.options[foundPrefix];
    var data = prefix ? prefix.data : [];
    var selectedIndex = this.state.selectedIndex;
    var showSelectionMenu = this.state.showSelectionMenu;

    var containerStyles = {
      position: 'relative',
      display: 'inline-block'
    };

    return (
      <div style={containerStyles}>
        {this.props.children}
        <CMDSelectionMenu
          foundPrefix={foundPrefix}
          prefix={prefix}
          data={data}
          selectedIndex={selectedIndex}
          showSelectionMenu={showSelectionMenu} />
      </div>
    );
  }
});

module.exports = CMDTextInput;
