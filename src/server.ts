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

const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority',
        dbName: 'zoo'
    })
    .then(() => {
        Logging.info('Connected to MongoDB');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect to MongoDB : ');
        Logging.error(error);
    });

/** Only start the server if Mongo connects */
const StartServer = () => {
    router.use((req, res, next) => {
        /** Log the request */
        Logging.info(
            `Incoming -> Method : [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );

        /** When res is finished, log the Response */
        res.on('finish', () => {
            /** Log the Response */
            Logging.info(
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
    router.use('/api/employee', employeeRoutes);
    router.use('/api/zone', zoneRoutes);
    router.use('/api/enclosure', enclosureRoutes);
    router.use('/api/vivarium', vivariumRoutes);
    router.use('/api/pond', pondRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) =>
        res.status(200).json({ message: 'pong' })
    );

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () =>
        Logging.info(`Server is running on port ${config.server.port}.`)
    );
};
