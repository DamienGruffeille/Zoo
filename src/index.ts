import { MongoConnect } from './init/dataSource.init';
import { ServerInit } from './init/server.init';
import Logging from './library/logging';

const NAMESPACE = 'INDEX';

Logging.info(NAMESPACE, 'DB init');
MongoConnect();
Logging.info(NAMESPACE, 'Server init');
ServerInit();
