
const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cookieParser());
const exphbs = require('express-handlebars');
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(express.static('public'));
app.use(fileUpload());
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
}));
app.set('view engine', '.hbs');

const routes = require('./routes');
app.use('/', routes);

const listener = app.listen(process.env.PORT || 3000, function () {
 console.log(`Node Gym started on port ${listener.address().port}`);
});

const wss = new WebSocket.Server({server: listener});
const initAssistantMessage = 'Hello there, my name is Rustem! I am your online-assistant. Wanna some help?';
const acceptMessage = 'Help yourself on your own (Kidding)<br> Print the number that suits you most<br>'
+ '1. Bad request, slow Internet<br> 2. Get details and contacts<br> 3. Leave complaint<br> 4. You have problems ';
const refuseMessage = 'No problem. Have a nice day!';
const message1 = 'Try restarting you PC';
const message2 = 'Our office is at Pushkina-Kolotushkina str, 69. Contact number is 8-800-555-355.';
const message3 = 'Call 666. This is ours hotline';
const message4 = 'Just solve them';
const invalidOptionMessage = 'Only yes/no answers accepted';

wss.on('connection', function connection(ws) {

    ws.send(initAssistantMessage);

    ws.on('message', function(message) {

        message = message.toLowerCase();
        let answer = invalidOptionMessage;
        if (message === 'yes') {
            answer = acceptMessage;
        } else if (message === 'no') {
            answer = refuseMessage;
        } else if (message === '1') {
          answer = message1;
        } else if (message === '2') {
          answer = message2;
        } else if (message === '3') {
          answer = message3;
        } else if (message === '4') {
          answer = message4;
      }
        ws.send(answer);
    });
});