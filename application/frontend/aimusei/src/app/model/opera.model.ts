export class Opera{
    id?: string;
    nome?: string;
    descrizione?: string;
    sintesi?: Sintesi[];
    hash?: "";
    lastUpdate?: string;
}

export class Sintesi{
    disabilita?: string;
    descrizione?: string;
    validata?: boolean;
    editor?: "";
    lastUpdate?: "";
}