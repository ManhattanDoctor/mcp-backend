import { FilterableMapCollection } from "@ts-core/common";
import MiniSearch from "minisearch";
import * as _ from 'lodash';

export class Codes extends FilterableMapCollection<ICode> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private mini: MiniSearch<ICode>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(raw: Record<string, string>) {
        super('code');
        this.addItems(Object.keys(raw).map(key => ({ code: key, description: _.trim(raw[key]) })));

        this.mini = new MiniSearch({ idField: 'code', fields: ['code', 'description'], searchOptions: { boost: { code: 2 }, fuzzy: 0.2 } });
        this.mini.addAll(this.collection);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public search(query: string, maximum?: number): Array<ICodeSearchResult> {
        if (_.isNil(maximum)) {
            maximum = 50;
        }
        return this.mini.search(query).slice(0, maximum).map(item => { return { score: item.score, item: this.get(item.id), } });
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