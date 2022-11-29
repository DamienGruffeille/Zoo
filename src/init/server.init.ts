import http from 'http';
import { Express } from 'express';
import { config } from '../config/config';
import Logging from '../library/logging';

const NAMESPACE = 'SERVER';

let server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
>;

const ServerInit = (app: Express) => {
    server = http.createServer(app);
    /** possible de remplace ce if par un --runInBand dans script test */
    if (process.env.NODE_ENV !== 'test') {
        server.listen(config.server.port, () => {
            Logging.info(
                NAMESPACE,
                `Server is running on port ${config.server.port}.`
            );
        });
    }
};

const CloseServer = async () => server.close();
export default { ServerInit, CloseServer };
