var PDFDocument = require('pdfkit')
  , im          = require('imagemagick');

var defaults = {
  greeting: "Hey Center City" 
, question: 'How do you use public recreation sites?'
, phoneNumber: '215-766-9451'
};

module.exports = function(req, res) {
  // Merge our submitted content and defaults
  var content = req.body;
  for (var key in defaults) {
    content[key] = content[key] || defaults[key];
  }

  /** Begin Layout **********************************/
  var doc = new PDFDocument({
    size: "LETTER"
  , layout: 'portrait'  
  });
  doc.compress = false; // https://github.com/devongovett/pdfkit/issues/77

  // Greeting
  doc.fontSize(40);
  doc.fillAndStroke("#888", "#888")
  doc.text(content.greeting, {
    align: 'left'
  });

  // Question
  doc.fontSize(60);
  doc.fillAndStroke("#444", "#444")
  doc.text(content.question, {
    align: 'left'
  });

  // Phone number
  doc.fontSize(20);
  doc.fillAndStroke("#888", "#888")
  doc.text('Send an SMS to ' + content.phoneNumber, {
    align: 'left'
  });

  /** End Layout ************************************/

  // Render and output
  doc.output(function(pdf) {
    if(req.params.format == 'pdf') {
      res.writeHead(200, {'Content-Type': 'application/pdf'});    
      res.end(pdf);
    }
    else if(req.params.format == 'png') {
      im.resize(
      {
        srcData : pdf,
        srcFormat : 'pdf', 
        strip : true,
        format: 'png',
        width: 612,
        height : 792 + "^",
        customArgs: [
            ,"-gravity", "center"
            ,"-extent", 612 + "x" + 792
            // ,"-density", '150x150'
            ]
      }
      , function(err, stdout, stderr) {
          if (err) { console.log(err) };
          var png = new Buffer(stdout, 'binary');
          if (req.route.method == 'get'){
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(png);
          }
          else if(req.route.method == 'post') {
            // return as base64 encoded string to be inserted into 
            // img element: 'data:image/png;base64,' + png
            res.end(png.toString('base64'));
          }
        }
      );
    }
  });
};