var HyperNotes = HyperNotes || {};

HyperNotes.View = function($) {
  var my = {};

  my.NoteAddView = Backbone.View.extend({
  });

  my.NoteView = Backbone.View.extend({
    tagName:  "li",

    events: {
      "dblclick div.note-content" : "edit",
      "click span.note-destroy"   : "clear",
      "keypress .note-input"      : "updateOnEnter"
    },

    initialize: function() {
      _.bindAll(this, 'render', 'close');
      this.model.bind('change', this.render);
      this.model.view = this;
    },

    render: function() {
      var tmplData = {
        note: this.model.toJSON()
      }
      var templated = $.tmpl(HyperNotes.Template.noteSummary, tmplData);
      $(this.el).html(templated);
      this.input = this.$('.note-input');
      this.input.bind('blur', this.close);
      return this;
    },

    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    close: function() {
      this.model.save({label: this.input.val()});
      $(this.el).removeClass("editing");
    },

    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    remove: function() {
      $(this.el).remove();
    },

    clear: function() {
      this.model.destroy();
      this.remove();
    }
  });

  my.NoteListView = Backbone.View.extend({
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-note":  "createOnEnter",
      "keyup #new-note":     "showTooltip"
    },

    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input    = this.$("#new-note");

      this.collection.bind('add',     this.addOne);
      this.collection.bind('refresh', this.addAll);
      this.collection.bind('all',     this.render);

      this.collection.fetch();
    },

    addOne: function(note) {
      var view = new my.NoteView({model: note});
      this.$("#note-list").append(view.render().el);
    },

    addAll: function() {
      this.collection.each(this.addOne);
    },

    newAttributes: function() {
      var summary = this.input.val();
      return HyperNotes.Util.parseNoteSummary(summary);
    },

    createOnEnter: function(e) {
      // enter key
      if (e.keyCode != 13) return;
      this.collection.create(this.newAttributes());
      this.input.val('');
    }
  });

  return my;
}(jQuery);
