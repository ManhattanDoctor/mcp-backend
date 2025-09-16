import { DynamicModule, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { FileUtil, ModeApplication } from '@ts-core/backend';
import { AppSettings } from './AppSettings';
import { Logger } from '@ts-core/common';
import { LoggerModule, TransportModule, TransportType } from '@ts-core/backend-nestjs';
import { Codes, InitializeService } from './service';
import { CodeTool } from './tool';
import { McpModule } from '@rekog/mcp-nest';
import { DATA } from './Data';

export class AppModule extends ModeApplication implements OnApplicationBootstrap {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: AppSettings): DynamicModule {
        return {
            module: AppModule,
            imports: [
                LoggerModule.forRoot(settings),
                TransportModule.forRoot({ type: TransportType.LOCAL }),
                McpModule.forRoot({ name: 'customs-codes', version: '1.0.0' })
            ],
            providers: [
                InitializeService,
                {
                    provide: AppSettings,
                    useValue: settings
                },
                {
                    provide: Codes,
                    inject: [Logger],
                    // useFactory: async () => new Codes(await FileUtil.jsonRead(`${`${process.cwd()}/data`}/code.json`))
                    useFactory: async (logger) => new Codes(logger, DATA)
                },
                CodeTool
            ]
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    public constructor(@Inject(Logger) logger: Logger, settings: AppSettings, private service: InitializeService) {
        super('MCP', settings, logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async onApplicationBootstrap(): Promise<void> {
        await super.onApplicationBootstrap();
        await this.service.initialize();
    }
}
