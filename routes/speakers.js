import express from "express";
import { Speakers } from "../database.js";
const router = express.Router();

// express routing middleware (get,put,post,delete) 
export default (params) => {
    // const { speakersService } = params;

    router.get('/', async (request, response, next) => {
        try {
            // const speakers = await speakersService.getList();
            const speakersV = await Speakers.find({}).then(speakers => speakers).catch(e => console.log(e));
            const speakersList = speakersV[0]['_doc'].speakers;
            const speakers = speakersList.map((speaker) => {
                return {
                    name: speaker.name,
                    shortname: speaker.shortname,
                    title: speaker.title,
                    summary: speaker.summary
                };
            });
            return response.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers });
        } catch (error) {
            return next(error)
        }

    });

    router.get('/:shortname', async (request, response, next) => {
        try {
            const speakersV = await Speakers.find({}).then(speakers => speakers).catch(e => console.log(e));
            const speakersList = speakersV[0]['_doc'].speakers;
            const speakerName = speakersList.find(elm => {
                return elm.shortname === request.params.shortname;
            });
            const speaker = {
                title: speakerName.title,
                name: speakerName.name,
                shortname: speakerName.shortname,
                description: speakerName.description
            };
            const artWorkSpeaker = speakersList.find(elm => {
                return elm.shortname === request.params.shortname;
            });
            const artWork = artWorkSpeaker.artwork;
            // const speaker = await speakersService.getSpeaker(request.params.shortname);
            // const artWork = await speakersService.getArtworkForSpeaker(request.params.shortname);
            response.render('layout', { pageTitle: 'Speakers', template: 'speakers-detail', speaker, artWork });
        } catch (error) {
            return next(error)
        }
    })
    // router.get('/:shortname', async (request, response) => {
    //     const artWork = await speakersService.getArtworkForSpeaker(request.params.shortname);
    //     console.log(artWork);
    // })
    return router;
};