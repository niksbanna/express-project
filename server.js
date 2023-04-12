import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';

// import SpeakersService from './services/SpeakerService.js';
// import FeedbackService from './services/FeedbackService.js'

// const speakersService = new SpeakersService('./data/speakers.json');
// const feedbackService = new FeedbackService('./data/feedback.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 3003;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: ['Nfjeridsfskdfdsfesd', 'dfeiVndfhewfisdfeete']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes());

mongoose.connect('mongodb+srv://dbUser:1ZdBAqgb3fTSElNo@cluster0.lsqkhwx.mongodb.net/Express-project?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


app.locals.siteName = 'NIKS Meetups';
app.locals.speakerNames = [
    { name: 'Lorenzo Garcia', shortname: 'Lorenzo_Garcia' },
    { name: 'Hilary Goldywynn Post', shortname: 'Hillary_Goldwynn' },
    { name: 'Riley Rudolph Rewington', shortname: 'Riley_Rewington' }
];
// express middleware
app.use(express.static(path.join(__dirname, 'static')));
// app.use(async (request, response, next) => {
//     try {
//         const names = await speakersService.getNames();
//         response.locals.speakerName = names;
//         return next();
//     } catch (error) {
//         console.error(error);
//         return next(error);
//     }
// });
app.listen(port, () => {
    console.log(`express is listening at port ${port}! http://localhost:${port}`);
});
