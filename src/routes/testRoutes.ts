import express from 'express';
import controller from '../controllers/test.controller';

const router = express.Router();

/**
 * @openapi
 * /api/test/ping:
 *   get:
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get('/ping', controller.ping);

export = router;
