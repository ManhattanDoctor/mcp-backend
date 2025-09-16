import { FilterableMapCollection, ILogger, Logger, TransportHttp } from "@ts-core/common";
import MiniSearch from "minisearch";
import * as _ from 'lodash';

export class Codes extends FilterableMapCollection<ICode> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private mini: MiniSearch<ICode>;
    private gnosis: TransportHttp

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(logger: ILogger, raw: Record<string, string>) {
        super('code');
        this.addItems(Object.keys(raw).map(key => ({ code: key, description: _.trim(raw[key]) })));

        this.mini = new MiniSearch({ idField: 'code', fields: ['code', 'description'], searchOptions: { boost: { code: 2 }, fuzzy: 0.2 } });
        this.mini.addAll(this.collection);

        this.gnosis = new TransportHttp(logger, { baseURL: 'https://api.gnosisai.ru/api', method: 'get', headers: { 'Authorization': 'Bearer 8ebb9813-5f97-4e35-a79b-8ee633be703d' } });
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public async search(query: string, maximum?: number): Promise<Array<ICodeSearchResult>> {
        if (_.isNil(maximum)) {
            maximum = 50;
        }
        let items = _.uniqBy(_.flatMap(await Promise.all([this.text(query, maximum), this.vector(query, maximum)])), 'item.code');
        return items.slice(0, maximum)
    }

    protected async text(query: string, maximum: number): Promise<Array<ICodeSearchResult>> {
        return this.mini.search(query).slice(0, maximum).map(item => { return { score: item.score, item: this.get(item.id), } });
    }

    protected async vector(query: string, maximum: number): Promise<Array<ICodeSearchResult>> {
        let items = new Array<ICodeSearchResult>();
        for (let item of await this.gnosis.call('fileContentVector/search', { data: { query, maxDocuments: maximum, minScore: 0.3, files: [508] } })) {
            let { score, content } = item;
            let code = content.substring(0, 13).replace(/ /g, '');
            if (this.has(code)) {
                items.push({ score, item: this.get(code) });
            }
        }
        return items;
    }
}

export interface ICodeSearchResult {
    item: ICode;
    score: number;
}
export interface ICode {
    code: string;
    description: string;
}