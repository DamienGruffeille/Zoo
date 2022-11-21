import express from 'express';
import controller from '../controllers/event.controller';

const router = express.Router();

router.post('/create', controller.createEvent);
