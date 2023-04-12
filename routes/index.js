import express from "express";
import speakerRouter from './speakers.js';
import feedbackRouter from './feedback.js';
import { Speakers } from "../database.js";
const router = express.Router();

// express routing middleware (get,put,post,delete) 
export default (params) => {
    // const { speakersService } = params;

    router.get('/', async (request, response, next) => {
        try {
            // const topSpeakers = await speakersService.getList();
            const speakersV = await Speakers.find({}).then(speakers => speakers).catch(e => console.log(e));
            const { speakers } = speakersV[0]['_doc'];
            const topSpeakers = speakers.map((speaker) => {
                return {
                    name: speaker.name,
                    shortname: speaker.shortname,
                    title: speaker.title,
                    summary: speaker.summary
                };
            });
            response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers });
        } catch (error) {
            return next(error)
        }
    });

    router.use('/speakers', speakerRouter(params));
    router.use('/feedback', feedbackRouter(params));
    return router;
};
