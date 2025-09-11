import { ILoggerSettings, Mode, LoggerSettings } from '@ts-core/backend';

export class AbstractSettings extends LoggerSettings implements ILoggerSettings {

    // --------------------------------------------------------------------------
    //
    //  Logger Properties
    //
    // --------------------------------------------------------------------------

    public get mode(): Mode {
        return this.getValue('NODE_ENV', Mode.DEVELOPMENT);
    }
}
