// this class is used to prevent people from leaaving the page if their data isn't saved
// must be instantiated after the dom is loaded
// example:
//   monitor = new FormPromptOnUnsaved({ ignore: ['[class*=new_]', '[action=/session]', '[action=/reset]', '[action*=version]', '[action~=/sections/]'] });
var FormPromptOnUnsaved = Class.create({
  
  initialize: function(options){
    if ($$('form').length <= 0) return null;
    this.saving = false;
    this.selector = 'form';
    this.setupSavingObservers();
    this.options = options || {};
    if (this.options.ignore) this.updateSelector(this.options.ignore);
    this.setOriginalFields();
  },
  
  setOriginalFields: function(){
    this.originalFields = this.collectFields();
    window.onbeforeunload = this.checkFields.bind(this);
  },
  
  setSaving: function(){
    this.saving = true;
  },
  
  setupSavingObservers: function () {
    this.savingElements = $$('.saving');
    for (var i=0; i < this.savingElements.length; i++) {
      this.savingElements[i].observe('click', this.setSaving.bind(this));
    };
  },
  
  collectFields: function () {
    return $$(this.selector).invoke('serialize').flatten().join('');
  },
  
  updateSelector: function () {
    var notThese = $A(arguments).flatten();
    for (var i=0; i < notThese.length; i++) {
      this.selector += ':not(' + notThese[i] + ')';
    };
  },
  
  ignore: function(){
    Event.stopObserving(window, 'beforeunload');
    this.updateSelector($A(arguments));
    this.setOriginalFields();
  },
  
  checkFields: function () {
    if (this.saving) return;
    if (this.originalFields != this.collectFields()) return 'You have unsaved changes. Click Cancel now, then \'Save\' to save them. Click OK now to discard them.';
  }
  
});
