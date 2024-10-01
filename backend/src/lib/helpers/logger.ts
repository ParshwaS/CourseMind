import logger, { destination } from 'pino';
import PinoHttp from 'pino-http';
import { HttpLogger } from 'pino-http';

class Logger {
    private fileName: string;
    public logger: logger.Logger;
    public HTTPLogger: HttpLogger;

    constructor(fileName?: string) {

        // If no file name is provided, we will create a new file with DD-MM-YYYY HH:MM:SS format

        if (!fileName) {
            fileName = `logs/log-${new Date().toLocaleDateString().replace(/\//g, '-')}-${new Date().toLocaleTimeString().replace(/:/g, '-')}.log`;
        }

        this.fileName = fileName;
        const transport = logger.transport({
            target: 'pino/file',
            options: {
                destination: this.fileName,
            },
        });

        this.logger = logger(transport);
        this.HTTPLogger = PinoHttp({ logger: this.logger });
    }
}

export default new Logger();