import http from 'http';
import { config } from '../config/config';
import Logging from '../library/logging';
import app from './app.init';

const NAMESPACE = 'SERVER';

export const ServerInit = () => {
    http.createServer(app).listen(config.server.port, () =>
        Logging.info(
            NAMESPACE,
            `Server is running on port ${config.server.port}.`
        )
    );
};
