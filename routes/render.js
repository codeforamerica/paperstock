var PDFDocument = require('pdfkit')
  , im          = require('imagemagick');

var defaults = {
  greeting: "Hey Center City" 
, question: 'How do you use public recreation sites?'
, phoneNumber: '215-766-9451'
};

var size = [612, 792];

module.exports = function(req, res) {
  var doc = new PDFDocument({
    size: "LETTER"
  , layout: 'portrait'  
  });
  doc.compress = false; // https://github.com/devongovett/pdfkit/issues/77

  var content = req.body;
  for (var key in defaults) {
    content[key] = content[key] || defaults[key];
  }

  // // Greeting
  // doc.text(content.greeting, 100, 100, {
  //   width: 410,
  //   align: 'left'
  // });


  // doc.text('Hello world!');
  doc.fillAndStroke("red", "#900")
  doc.text("Hello world!", 100, 100);


  doc.font('Times-Roman')
     .text('Hello from Times Roman!', 100, 100)
     .moveDown(0.5);


  // // Question
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "blue";
  // ctx.font = '80px san-serif';
  // var nextY = wrapText(ctx, content.question, 17, 100, 600, 85);

  // // PhoneNumber
  // ctx.textBaseline = "middle";
  // ctx.fillStyle = "red";
  // ctx.font = '30px san-serif';
  // ctx.fillText("Send an SMS to " + content.phoneNumber, 17, nextY + 20);

  // if (req.params.format == 'png') {
  //   if (req.route.method == "get") {
  //     res.writeHead(200, {'Content-Type': 'image/png'});
  //     var stream = canvas.createPNGStream();
  //     stream.on('data', function(chunk){
  //       res.write(chunk);
  //     });
  //     stream.on('end', function() {
  //       res.end();
  //     });
  //     stream.on('close', function() {
  //       console.log("Rendered PNG");
  //     });
  //   }
  //   else if (req.route.method == "post") {
  //     var output = canvas.toBuffer();
  //     res.end(output.toString('base64'));
  //   }
  // }
  // else 

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
            ,"-density", '150x150'
            ]
      }
      , function(err, stdout, stderr) {
          console.log(err);
          var png = new Buffer(stdout, 'binary');
          if (req.route.method == 'get'){
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(png);

          }
          else if(req.route.method == 'post') {
            res.end(png.toString('base64'));
          }
        }
      );
    }
  });
};


function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(" ");
  var line = "";

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if(testWidth > maxWidth) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  return y + lineHeight/2;
}