import express from 'express';
import Logging from '../library/logging';
import employeeRoutes from '../routes/employeeRoutes';
import zoneRoutes from '../routes/zoneRoutes';
import enclosureRoutes from '../routes/enclosureRoutes';
import vivariumRoutes from '../routes/vivariumRoutes';
import pondRoutes from '../routes/pondRoutes';
import specieRoutes from '../routes/specieRoutes';
import animalRoutes from '../routes/animalRoutes';
import eventRoutes from '../routes/eventRoutes';
import actionRoutes from '../routes/actionRoutes';

const app = express();
const NAMESPACE = 'APP';

/** Only start the server if Mongo connects */
export const StartServer = () => {
    app.use((req, res, next) => {
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

    app.use(express.urlencoded({ extended: true }));
    /** Express includes BodyParser */
    app.use(express.json());

    /** Rules of the API */
    app.use((req, res, next) => {
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
    app.use('/api/employes', employeeRoutes);
    app.use('/api/zone', zoneRoutes);
    app.use('/api/enclos', enclosureRoutes);
    app.use('/api/vivariums', vivariumRoutes);
    app.use('/api/bassins', pondRoutes);
    app.use('/api/especes', specieRoutes);
    app.use('/api/animaux', animalRoutes);
    app.use('/api/evenements', eventRoutes);
    app.use('/api/actions', actionRoutes);

    /** Healthcheck */
    app.get('/ping', (req, res, next) =>
        res.status(200).json({ message: 'pong' })
    );

    /** Error handling */
    app.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(NAMESPACE, error);

        return res.status(404).json({ message: error.message });
    });
};

export default app;
