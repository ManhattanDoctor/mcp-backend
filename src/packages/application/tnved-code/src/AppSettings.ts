import { AbstractSettings } from '@project/module/core';

export class AppSettings extends AbstractSettings {
    // --------------------------------------------------------------------------
    //
    //  Web Properties
    //
    // --------------------------------------------------------------------------

    public get webPort(): number {
        return this.getValue('WEB_PORT', 3001);
    }

    public get webHost(): string {
        return this.getValue('WEB_HOST', 'localhost');
    }
}
