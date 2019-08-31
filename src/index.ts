
export interface Ready<X> {
    value?: X;
    complete: boolean;
}

export function waitForImpl<X>(
        repeatEvery: (f: () => void, n: number) => NodeJS.Timeout,
        finishRepeatUntil: (n: NodeJS.Timeout) => void,
        getTime: () => number,
        f: () => Promise<Ready<X>>,
        getNewDelay: (attempts: number) => number): Promise<X> {

    let requestStartTime = getTime();
    let attempts = 0;
    let inProgress = false;

    return new Promise((resolve, reject) => {

        function caller() {
            requestStartTime = getTime();
            inProgress = true;
            attempts = attempts + 1;
            try {
                f().then((r: Ready<X>) => {
                    inProgress = false;
                    if (r.complete) {
                        finishRepeatUntil(interval);
                        return resolve(<X>r.value)
                    }
                }).catch((e) => {
                    finishRepeatUntil(interval);
                    reject(e);
                });
            } catch(e) {
                finishRepeatUntil(interval);
                reject(e);
            }
        }

        caller();

        const interval = repeatEvery(
            () => {
                if (inProgress) { return; }
                if (getTime() - requestStartTime > getNewDelay(attempts)) {
                    caller();
                }
            },
            10
        );

    });

}

export function waitFor<X>(
        f: () => Promise<Ready<X>>,
        getNewDelay: (attempts: number) => number): Promise<X> {

    return waitForImpl(
        setInterval,
        clearTimeout,
        () => new Date().getTime(),
        f,
        getNewDelay
    );
}

export default waitFor;
