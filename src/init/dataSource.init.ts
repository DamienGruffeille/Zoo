import mongoose from 'mongoose';
import { config } from '../config/config';
import Logging from '../library/logging';
import { StartServer } from '../init/app.init';

const NAMESPACE = 'DB CNX';

/** Connect to Mongo */
export const MongoConnect = () => {
    mongoose
        .connect(config.mongo.url, {
            retryWrites: true,
            w: 'majority',
            dbName: 'zoo'
        })
        .then(() => {
            Logging.info(NAMESPACE, 'Connected to MongoDB');
            Logging.info(NAMESPACE, 'Launching server');
            StartServer();
        })
        .catch((error) => {
            Logging.error(NAMESPACE, 'Unable to connect to MongoDB : ');
            Logging.error(NAMESPACE, error);
        });
};
