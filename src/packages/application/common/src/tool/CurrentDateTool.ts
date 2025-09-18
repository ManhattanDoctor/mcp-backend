import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { Logger, LoggerWrapper } from '@ts-core/common';
import { z } from 'zod';


// --------------------------------------------------------------------------
//
//  Interfaces
//
// --------------------------------------------------------------------------


interface ICurrentDateGetDtoResponse {
    date: Date;
}
const ICurrentDateGetDtoResponseSchema = z.object({
    date: z.date().describe('Текущая дата'),
})

@Injectable()
export class CurrentDateTool extends LoggerWrapper {

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

    @Tool({
        name: 'current_date_get',
        description: 'Возвращает текущую дату.',
        annotations: { readOnlyHint: true, idempotentHint: true },
        outputSchema: ICurrentDateGetDtoResponseSchema
    })
    public async get(): Promise<ICurrentDateGetDtoResponse> {
        return { date: new Date() };
    }
}