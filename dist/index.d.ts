/// <reference types="node" />
export interface Ready<X> {
    value?: X;
    complete: boolean;
}
export declare function waitForImpl<X>(repeatEvery: (f: () => void, n: number) => NodeJS.Timeout, finishRepeatUntil: (n: NodeJS.Timeout) => void, getTime: () => number, f: () => Promise<Ready<X>>, getNewDelay: (attempts: number) => number): Promise<X>;
export declare function waitFor<X>(f: () => Promise<Ready<X>>, getNewDelay: (attempts: number) => number): Promise<X>;
export default waitFor;
