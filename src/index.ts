import { MongoConnect } from './init/dataSource.init';
import Logging from './library/logging';
import App from './init/app.init';
import Server from './init/server.init';

const NAMESPACE = 'INDEX';

Logging.info(NAMESPACE, 'Creating App');
const app = App.createApp();
Logging.info(NAMESPACE, 'Launching Server');
Server.ServerInit(app);
Logging.info(NAMESPACE, 'DB init');
MongoConnect();
