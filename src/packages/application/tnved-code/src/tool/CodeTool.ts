import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { ExtendedError, Logger, LoggerWrapper } from '@ts-core/common';
import { Codes, ICode, ICodeSearchResult } from '../service';
import { z } from 'zod';
import * as _ from 'lodash';


// --------------------------------------------------------------------------
//
//  Interfaces
//
// --------------------------------------------------------------------------

interface ICodeSearchDto {
    query: string;
    maximum?: number;
}
interface ICodeSearchDtoResponse {
    items: Array<ICodeSearchResult>;
}
interface ICodeGetDto {
    code: number;
}
interface ICodeGetDtoResponse {
    item: ICode;
}

const ICodeSchema = z.object({
    code: z.string().describe('Код классификации товара'),
    description: z.string().describe('Описание классификации товара'),
})
const ICodeSearchResultSchema = z.object({
    item: ICodeSchema.describe('Код классификации товара с описанием'),
    score: z.number().describe('Величина оценки результата поиска'),
})
const ICodeSearchDtoSchema = z.object({
    query: z.string().describe('Запрос для поиска кода'),
    maximum: z.number().describe('Максимальное количество результатов поиска').optional(),
})
const ICodeSearchDtoResponseSchema = z.object({
    items: z.array(ICodeSearchResultSchema).describe('Результат поиска кодов классификации товара'),
})
const ICodeGetDtoSchema = z.object({
    code: z.string().describe('Код классификации товара'),
})
const ICodeGetDtoResponseSchema = z.object({
    item: ICodeSchema.describe('Код классификации товара с описанием'),
})

@Injectable()
export class CodeTool extends LoggerWrapper {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private items: Codes) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Tool({
        name: 'customs_code_get',
        description: 'Возвращает конкретный таможенный код с описанием по уникальному идентификатору.',
        annotations: { readOnlyHint: true, idempotentHint: true },
        parameters: ICodeGetDtoSchema,
        outputSchema: ICodeGetDtoResponseSchema
    })
    public async get(item: ICodeGetDto): Promise<ICodeGetDtoResponse> {
        let { code } = item;
        if (!this.items.has(code)) {
            throw new ExtendedError(`Код классификации товара с идентификатором "${code}" не найден.`);
        }
        this.logger.log(`Под коду "${code}" есть детальное описание`);
        return { item: this.items.get(code) };
    }

    @Tool({
        name: 'customs_codes_search',
        description: 'Поиск таможенных кодов по указанному запросу.',
        annotations: { readOnlyHint: true, idempotentHint: true },
        parameters: ICodeSearchDtoSchema,
        outputSchema: ICodeSearchDtoResponseSchema
    })
    public async search(item: ICodeSearchDto): Promise<ICodeSearchDtoResponse> {
        let { query, maximum } = item;
        let items = await this.items.search(query, maximum);
        if (_.isEmpty(items)) {
            throw new ExtendedError(`Не удалось найти никаких таможенных кодов по запросу "${query}", попробуйте изменить запрос или поискать по схожим словам.`);
        }
        this.logger.log(`Поиск по запросу "${query}", нашел "${items.length}" кодов`);
        return { items };
    }
}