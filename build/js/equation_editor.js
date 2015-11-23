var slice = [].slice;

window.EquationEditor = {};

EquationEditor.Events = {
  on: function(name, callback, context) {
    var base;
    this._events || (this._events = {});
    (base = this._events)[name] || (base[name] = []);
    return this._events[name].push({
      callback: callback,
      context: context || this
    });
  },
  trigger: function(name) {
    var args, events;
    if (!this._events) {
      return;
    }
    args = Array.prototype.slice.call(arguments, 1);
    if ((events = this._events[name])) {
      return this.triggerEvents(events, args);
    }
  },
  triggerEvents: function(events, args) {
    var event, i, len, ref, results;
    results = [];
    for (i = 0, len = events.length; i < len; i++) {
      event = events[i];
      results.push((ref = event.callback).call.apply(ref, [event.context].concat(slice.call(args))));
    }
    return results;
  }
};

EquationEditor.View = (function() {
  View.prototype.$ = function(selector) {
    return this.$el.find(selector);
  };

  function View(options) {
    this.options = options;
    this.$el = this.options.$el || $(this.options.el);
    this.initialize.apply(this, arguments);
  }

  View.prototype.initialize = function() {};

  View.prototype.createElement = function() {
    return this.$el = $(this.template());
  };

  return View;

})();

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EquationEditor.CollapsibleView = (function(superClass) {
  extend(CollapsibleView, superClass);

  function CollapsibleView() {
    this.toggleCollapse = bind(this.toggleCollapse, this);
    return CollapsibleView.__super__.constructor.apply(this, arguments);
  }

  CollapsibleView.prototype.initialize = function() {
    return this.$('.collapsible-box-toggle').on('click', this.toggleCollapse);
  };

  CollapsibleView.prototype.toggleCollapse = function(e) {
    e.preventDefault();
    if (this.$('.box-content-collapsible').is(':visible')) {
      return this.closeCollapsible();
    } else {
      return this.openCollapsible();
    }
  };

  CollapsibleView.prototype.openCollapsible = function() {
    this.$('.box-content-collapsible').slideDown();
    return this.toggleOpenClass();
  };

  CollapsibleView.prototype.closeCollapsible = function() {
    this.$('.box-content-collapsible').slideUp();
    return this.toggleOpenClass();
  };

  CollapsibleView.prototype.toggleOpenClass = function() {
    return this.$('.collapsible-box-toggle').toggleClass('collapsible-box-toggle-open');
  };

  return CollapsibleView;

})(EquationEditor.View);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EquationEditor.Buttons = {};

EquationEditor.Buttons.BaseButtonView = (function(superClass) {
  extend(BaseButtonView, superClass);

  function BaseButtonView() {
    this.handleClick = bind(this.handleClick, this);
    return BaseButtonView.__super__.constructor.apply(this, arguments);
  }

  BaseButtonView.prototype.initialize = function() {
    this.latex = this.options.latex;
    this.buttonText = this.options.buttonText || this.options.latex;
    return this.className = ['math-button', this.options.className].join(' ').trim();
  };

  BaseButtonView.prototype.handleClick = function(e) {
    e.preventDefault();
    return EquationEditor.Events.trigger("latex:" + this.event, this.latex);
  };

  BaseButtonView.prototype.render = function() {
    this.createElement();
    this.$('a').on('click', this.handleClick);
    return this;
  };

  BaseButtonView.prototype.template = function() {
    return "<div class=\"" + this.className + "\">\n  <a title=\"" + this.buttonText + "\" href=\"#\">" + this.buttonText + "</a>\n</div>";
  };

  return BaseButtonView;

})(EquationEditor.View);

EquationEditor.Buttons.CommandButtonView = (function(superClass) {
  extend(CommandButtonView, superClass);

  function CommandButtonView() {
    return CommandButtonView.__super__.constructor.apply(this, arguments);
  }

  CommandButtonView.prototype.event = 'command';

  return CommandButtonView;

})(EquationEditor.Buttons.BaseButtonView);

EquationEditor.Buttons.WriteButtonView = (function(superClass) {
  extend(WriteButtonView, superClass);

  function WriteButtonView() {
    return WriteButtonView.__super__.constructor.apply(this, arguments);
  }

  WriteButtonView.prototype.event = 'write';

  return WriteButtonView;

})(EquationEditor.Buttons.BaseButtonView);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EquationEditor.ButtonGroupView = (function(superClass) {
  extend(ButtonGroupView, superClass);

  function ButtonGroupView() {
    this.toggle = bind(this.toggle, this);
    return ButtonGroupView.__super__.constructor.apply(this, arguments);
  }

  ButtonGroupView.prototype.initialize = function() {
    this.groupName = this.options.groupName;
    return this.buttonViews = this.options.buttonViews;
  };

  ButtonGroupView.prototype.render = function() {
    this.createElement();
    this.renderButtons();
    new EquationEditor.CollapsibleView({
      $el: this.$el
    });
    this.$('header').click(this.toggle);
    return this;
  };

  ButtonGroupView.prototype.toggle = function() {
    return this.$('.collapsible-box-toggle').click();
  };

  ButtonGroupView.prototype.renderButtons = function() {
    var buttonView, i, len, ref, results;
    ref = this.buttonViews;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      buttonView = ref[i];
      results.push(this.$('.buttons').append(buttonView.render().$el));
    }
    return results;
  };

  ButtonGroupView.prototype.template = function() {
    return "<div class=\"button-group collapsible\">\n  <a href='#' class='collapsible-box-toggle ss-dropdown'></a> <header>" + this.groupName + "</header>\n\n  <div class=\"buttons box-content-collapsible hidden\"></div>\n</div>";
  };

  return ButtonGroupView;

})(EquationEditor.View);

EquationEditor.ButtonViewFactory = {
  create: function(config) {
    var buttonConfig, buttons, i, klass, len;
    buttons = [];
    for (i = 0, len = config.length; i < len; i++) {
      buttonConfig = config[i];
      klass = eval(buttonConfig.klass);
      buttons.push(new klass(buttonConfig));
    }
    return buttons;
  }
};

EquationEditor.ButtonGroupViewFactory = {
  create: function(config) {
    var buttonGroupConfig, buttonGroups, i, len;
    buttonGroups = [];
    for (i = 0, len = config.length; i < len; i++) {
      buttonGroupConfig = config[i];
      buttonGroupConfig.buttonViews = EquationEditor.ButtonViewFactory.create(buttonGroupConfig.buttonViews);
      buttonGroups.push(new EquationEditor.ButtonGroupView(buttonGroupConfig));
    }
    return buttonGroups;
  }
};

var ButtonGroup, Buttons,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Buttons = EquationEditor.Buttons;

ButtonGroup = EquationEditor.ButtonGroupView;

EquationEditor.EquationEditorView = (function(superClass) {
  extend(EquationEditorView, superClass);

  function EquationEditorView() {
    this.focus = bind(this.focus, this);
    this.handleWriteButton = bind(this.handleWriteButton, this);
    this.handleCommandButton = bind(this.handleCommandButton, this);
    return EquationEditorView.__super__.constructor.apply(this, arguments);
  }

  EquationEditorView.prototype.initialize = function() {
    this.existingLatex = this.options.existingLatex;
    this.restrictions = this.options.restrictions || {};
    EquationEditor.Events.on('latex:command', this.handleCommandButton, this);
    return EquationEditor.Events.on('latex:write', this.handleWriteButton, this);
  };

  EquationEditorView.prototype.render = function() {
    $.getJSON('config.json').done((function(_this) {
      return function(config) {
        _this.config = config;
        _this.addButtonBar();
        _this.addButtonGroups();
        return _this.enableMathMagic();
      };
    })(this));
    return this;
  };

  EquationEditorView.prototype.enableMathMagic = function() {
    this.$('.math-button a').mathquill();
    this.input().mathquill('editable');
    if (this.existingLatex != null) {
      this.input().mathquill('latex', this.existingLatex);
    }
    return this.focus();
  };

  EquationEditorView.prototype.input = function() {
    return this.$('.math');
  };

  EquationEditorView.prototype.addButtonBar = function() {
    var button, i, len, ref, results;
    ref = this.buttonBarButtons();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      results.push(this.$('.button-bar').append(button.render().$el));
    }
    return results;
  };

  EquationEditorView.prototype.addButtonGroups = function() {
    var buttonGroup, i, len, ref, results;
    ref = this.buttonGroups();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      buttonGroup = ref[i];
      results.push(this.$('.button-groups').append(buttonGroup.render().$el));
    }
    return results;
  };

  EquationEditorView.prototype.buttonBarButtons = function() {
    return EquationEditor.ButtonViewFactory.create(this.config.buttonBar);
  };

  EquationEditorView.prototype.buttonGroups = function() {
    var groups;
    groups = this.basicButtonGroups();
    if (!this.restrictions.disallow_intermediate) {
      groups = groups.concat(this.intermediateButtonGroups());
    }
    if (!this.restrictions.disallow_advanced) {
      groups = groups.concat(this.advancedButtonGroups());
    }
    return groups;
  };

  EquationEditorView.prototype.basicButtonGroups = function() {
    return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.basic);
  };

  EquationEditorView.prototype.intermediateButtonGroups = function() {
    return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.intermediate);
  };

  EquationEditorView.prototype.advancedButtonGroups = function() {
    return EquationEditor.ButtonGroupViewFactory.create(this.config.buttonGroups.advanced);
  };

  EquationEditorView.prototype.handleCommandButton = function(latex) {
    this.performCommand(latex);
    return this.focus();
  };

  EquationEditorView.prototype.handleWriteButton = function(latex) {
    this.performWrite(latex);
    return this.focus();
  };

  EquationEditorView.prototype.performCommand = function(latex) {
    return this.input().mathquill('cmd', latex);
  };

  EquationEditorView.prototype.performWrite = function(latex) {
    return this.input().mathquill('write', latex);
  };

  EquationEditorView.prototype.focus = function() {
    return this.$('textarea').focus();
  };

  EquationEditorView.prototype.equationLatex = function() {
    return this.input().mathquill('latex');
  };

  return EquationEditorView;

})(EquationEditor.View);
