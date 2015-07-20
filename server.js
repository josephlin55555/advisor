var express = require('express');
var application = express();

var port = process.env.PORT || 8000;

application.set('view engine', 'ejs');
application.use(express.static(__dirname));

application.listen(port, function() {
  console.log('acmeAdvisor is running on port ' + port);
});