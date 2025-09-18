import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common';

@Injectable()
export class InitializeService extends LoggerWrapper {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async initialize(): Promise<void> { }
}
