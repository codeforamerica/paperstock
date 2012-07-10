var Canvas = require('canvas')
  , fs     = require('fs');

var defaults = {
  greeting: "Hey Center City" 
, question: 'How do you use public recreation sites?'
, phoneNumber: '215-766-9451'
};

var size = [590, 775];

module.exports = function(req, res) {
  var canvas
    , ctx;

  var content = req.body;
  for (var key in defaults) {
    content[key] = content[key] || defaults[key];
  }

  if (req.params.format == 'png') {
    canvas = new Canvas(size[0], size[1]);
  }
  else if(req.params.format == 'pdf') {
    canvas = new Canvas(size[0], size[1],'pdf');
  }
  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // background color
  ctx.fillRect(0,0,size[0],size[1]);

  // Greeting
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#888888";
  ctx.font = '40px san-serif';
  ctx.fillText(content.greeting, 20, 40);

  // Question
  ctx.textBaseline = "middle";
  ctx.fillStyle = "blue";
  ctx.font = '80px san-serif';
  var nextY = wrapText(ctx, content.question, 17, 100, 600, 85);

  // PhoneNumber
  ctx.textBaseline = "middle";
  ctx.fillStyle = "red";
  ctx.font = '30px san-serif';
  ctx.fillText("Send an SMS to " + content.phoneNumber, 17, nextY + 20);

  if (req.params.format == 'png') {
    if (req.route.method == "get") {
      res.writeHead(200, {'Content-Type': 'image/png'});
      var stream = canvas.createPNGStream();
      stream.on('data', function(chunk){
        res.write(chunk);
      });
      stream.on('end', function() {
        res.end();
      });
      stream.on('close', function() {
        console.log("Rendered PNG");
      });
    }
    else if (req.route.method == "post") {
      var output = canvas.toBuffer();
      res.end(output.toString('base64'));
    }
  }
  else if(req.params.format == 'pdf') {
    res.writeHead(200, {'Content-Type': 'application/pdf'});
    var output = canvas.toBuffer(); 
    res.end(output);
    // canvas.toBuffer(function(err, buffer){
    //   console.log(err);
    //   console.log("ben");
    //   console.log(buffer.toString);

    // });
  }
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