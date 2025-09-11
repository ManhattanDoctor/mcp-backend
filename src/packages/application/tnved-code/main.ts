import { NestFactory } from '@nestjs/core';
import { DateUtil } from '@ts-core/common';
import { DefaultLogger } from '@ts-core/backend-nestjs';
import { AppModule, AppSettings } from './src';
import { FileUtil } from '@ts-core/backend';

// --------------------------------------------------------------------------
//
//  Bootstrap
//
// --------------------------------------------------------------------------

async function bootstrap(): Promise<void> {
    let settings = new AppSettings();
    let logger = (settings.logger = new DefaultLogger(settings.loggerLevel));

    let application = await NestFactory.create(AppModule.forRoot(settings), { logger });
    application.useLogger(logger);

    let server = application.getHttpServer();
    server.setTimeout(10 * DateUtil.MILLISECONDS_MINUTE);

    await application.listen(settings.webPort);
    logger.log(`Listening "${settings.webPort}" port`);

}

bootstrap();
