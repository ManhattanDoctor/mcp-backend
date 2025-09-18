import { DynamicModule, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ModeApplication } from '@ts-core/backend';
import { AppSettings } from './AppSettings';
import { Logger } from '@ts-core/common';
import { LoggerModule, TransportModule, TransportType } from '@ts-core/backend-nestjs';
import { InitializeService } from './service';
import { McpModule } from '@rekog/mcp-nest';
import { CurrentDateTool } from './tool';

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
                McpModule.forRoot({ name: 'common', version: '1.0.0' })
            ],
            providers: [
                InitializeService,
                {
                    provide: AppSettings,
                    useValue: settings
                },
                CurrentDateTool
            ]
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    public constructor(@Inject(Logger) logger: Logger, settings: AppSettings, private service: InitializeService) {
        super('COMMON', settings, logger);
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
