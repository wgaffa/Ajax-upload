var Upload = new Class({
  Implements: [Events, Options],
  options: {
    onSubmit: function() {return true;}
  },
  
  initialize: function(form, options) {
    this.setOptions(options);
    
    this.formElement = $(form);
    
    this.formElement.addEvent('submit', this.formSubmit.bind(this));
  },
  
  formSubmit: function () {
    this.iframe = new IFrame({
      src: 'javascript:false;',
      styles: {
        display: 'none',
        width: 0,
        height: 0
      }
    });
    
    // set the forms target to the newly created iframe and
    // inject the iframe
    this.formElement.set('target', this.iframe.get('name'));
    this.iframe.inject($$('body')[0]);
    
    // call submit callback
    doSubmit = this.fireEvent('submit');
    
    var toDeleteFlag = false;
    
    // only submit if the onSubmit function returns true
    if (doSubmit) {
      this.formElement.submit();
      
      this.iframe.addEvent('load', function () {
        if (// For Safari
          this.iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" ||
          // For FF, IE
          this.iframe.src == "javascript:'<html></html>';"){           
          
          // First time around, do not delete.
          if( toDeleteFlag ){
            // Fix busy state in FF3
            setTimeout( function() {
              this.iframe.destroy();
            }.bind(this), 0);
          }
          return;
        }
        
        responseText = this.iframe.contentWindow.document.body.innerHTML;
        this.fireEvent('complete', responseText);
        
        toDeleteFlag = true;
        
        this.iframe.src = "javascript:'<html></html>';";
        this.formElement.erase('target');
        
        return true;
      }.bind(this));
      
    }
    
    return true;
  }
});