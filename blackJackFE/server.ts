import * as express from 'express';
import * as path from 'path';

const app = express();

// Serve i file statici dall'app Angular dist
app.use(express.static(__dirname + '/dist/black-jack-fe'));

// Path di fallback per tutte le altre richieste
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/black-jack-fe/index.html'));
});

// Avvia l'app sulla porta specificata da Heroku
const port = process.env['PORT'] || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


