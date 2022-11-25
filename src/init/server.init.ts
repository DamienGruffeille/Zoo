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

    server.listen(config.server.port, () =>
        Logging.info(
            NAMESPACE,
            `Server is running on port ${config.server.port}.`
        )
    );
};

const CloseServer = () => {
    Logging.warn(NAMESPACE, server);
    server.close();
};

export default { ServerInit, CloseServer };
