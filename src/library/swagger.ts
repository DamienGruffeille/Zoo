import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import Logging from './logging';

const NAMESPACE = 'SWAGGER';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Zoo API', version },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/model/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
    //Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    //Docs in JSON format
    app.get('docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    Logging.info(NAMESPACE, `Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
