import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';
import employeeRoutes from './routes/employeeRoutes';
import zoneRoutes from './routes/zoneRoutes';
import enclosureRoutes from './routes/enclosureRoutes';
import vivariumRoutes from './routes/vivariumRoutes';
import pondRoutes from './routes/pondRoutes';
import specieRoutes from './routes/specieRoutes';
import animalRoutes from './routes/animalRoutes';
import eventRoutes from './routes/eventRoutes';
import actionRoutes from './routes/actionRoutes';

const NAMESPACE = 'SERVER';
const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority',
        dbName: 'zoo'
    })
    .then(() => {
        Logging.info(NAMESPACE, 'Connected to MongoDB');
        StartServer();
    })
    .catch((error) => {
        Logging.error(NAMESPACE, 'Unable to connect to MongoDB : ');
        Logging.error(NAMESPACE, error);
    });

/** Only start the server if Mongo connects */
const StartServer = () => {
    router.use((req, res, next) => {
        /** Log the request */
        Logging.info(
            NAMESPACE,
            `Incoming -> Method : [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );

        /** When res is finished, log the Response */
        res.on('finish', () => {
            /** Log the Response */
            Logging.info(
                NAMESPACE,
                `Incoming -> Method : [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
            );
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    /** Express includes BodyParser */
    router.use(express.json());

    /** Rules of the API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );

        if (req.method == 'OPTIONS') {
            res.header(
                'Access-Control-Allow-Methods',
                'PUT, POST, PATCH, DELETE, GET'
            );
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    router.use('/api/employes', employeeRoutes);
    router.use('/api/zone', zoneRoutes);
    router.use('/api/enclos', enclosureRoutes);
    router.use('/api/vivariums', vivariumRoutes);
    router.use('/api/bassins', pondRoutes);
    router.use('/api/especes', specieRoutes);
    router.use('/api/animaux', animalRoutes);
    router.use('/api/evenements', eventRoutes);
    router.use('/api/actions', actionRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) =>
        res.status(200).json({ message: 'pong' })
    );

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(NAMESPACE, error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () =>
        Logging.info(
            NAMESPACE,
            `Server is running on port ${config.server.port}.`
        )
    );
};
