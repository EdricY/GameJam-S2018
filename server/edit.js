var fs = require('fs');
var x = 0;

function write() {
  fs.writeFile("number", x, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
}

setInterval(() => {
  x += 2;
  write();
}, 5000);
