// INTERFACE
$(document).ready(function() {
  // Tooltips
  $("[rel=tooltip]").tooltip();

  // Tablesorter
  $("#endpoints").tablesorter({});

  $('button#get-preview').click( function(event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url:'/render.png',
      data: $('form#pdf').serializeObject(),
      success: function(data){
        $('img#preview').attr('src', 'data:image/png;base64,' + data); 
      }
    });
  });

  // $('button#get-pdf').click( function(event) {
  //   event.preventDefault();
  //   $.ajax({
  //     type: "POST",
  //     url:'/render.pdf',
  //     data: $('form#pdf').serializeObject()
  //   });
  // });

  // Converts a form to JSON
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

});