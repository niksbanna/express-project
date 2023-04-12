import express from "express";
import { check, validationResult } from "express-validator";
import { Feedback } from "../database.js";

const router = express.Router();
const validations = [

    check('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A name is required'),

    check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('A valid email address is required'),

    check('title')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A title is required'),

    check('message')
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage('A message is required')

];

// express routing middleware (get,put,post,delete) 
export default (params) => {
    // const { feedbackService } = params;
    router.get('/', async (request, response, next) => {
        try {
            const feedback = await Feedback.find({}).then((feedback) => feedback);
            feedback.reverse();
            const errors = request.session.feedback ? request.session.feedback.errors : false;
            const successMessage = request.session.feedback ? request.session.feedback.message : false;
            request.session.feedback = {};
            return response.render('layout', { pageTitle: 'Feedback', template: 'feedback', feedback, errors, successMessage });
        } catch (error) {
            return next(error)
        }
    });

    router.post('/', validations, async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                request.session.feedback = {
                    errors: errors.array()
                };
                return response.redirect('/feedback');
            }
            // const { name, email, title, message } = request.body;
            // await feedbackService.addEntry(name, email, title, message);
            const getFeedback = await Feedback.find({});
            request.session.feedback = {
                message: 'Thank you for your feedback!'
            }
            return response.redirect('/feedback', { getFeedback });
        } catch (error) {
            return next(error);
        }
    });

    router.post('/api', validations, async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.json({ errors: errors.array() })
            }
            const { name, email, title, message } = request.body;
            const newFeed = new Feedback({ name: name, email: email, title: title, message: message });
            await newFeed.save().then(() => console.log('one entry added'), err => console.log(err));
            // await feedbackService.addEntry(name, email, title, message);
            const feedback = await Feedback.find({}).then((feedback) => feedback);
            feedback.reverse();
            // const feedback = await feedbackService.getList();
            return response.json({ feedback, successMessage: 'Thank you for your feedback!' });
        } catch (error) {
            return next(error)
        }
    });

    return router;
};