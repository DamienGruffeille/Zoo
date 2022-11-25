import mongoose from 'mongoose';
import { config } from '../config/config';
import Logging from '../library/logging';

const NAMESPACE = 'DB CNX';
let dataBase: any;

/** Connect to Mongo */
export const MongoConnect = () => {
    dataBase = mongoose
        .connect(config.mongo.url, {
            retryWrites: true,
            w: 'majority',
            dbName: 'zoo'
        })
        .then(() => {
            Logging.info(NAMESPACE, 'Connected to MongoDB');
        })
        .catch((error) => {
            Logging.error(NAMESPACE, 'Unable to connect to MongoDB : ');
            Logging.error(NAMESPACE, error);
        });
};

export const closeDB = () => {
    mongoose.disconnect();
};
