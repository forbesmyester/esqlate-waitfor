"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function waitForImpl(repeatEvery, finishRepeatUntil, getTime, f, getNewDelay) {
    var requestStartTime = getTime();
    var attempts = 0;
    var inProgress = false;
    return new Promise(function (resolve, reject) {
        function caller() {
            requestStartTime = getTime();
            inProgress = true;
            attempts = attempts + 1;
            try {
                f().then(function (r) {
                    inProgress = false;
                    if (r.complete) {
                        finishRepeatUntil(interval);
                        return resolve(r.value);
                    }
                }).catch(function (e) {
                    finishRepeatUntil(interval);
                    reject(e);
                });
            }
            catch (e) {
                finishRepeatUntil(interval);
                reject(e);
            }
        }
        caller();
        var interval = repeatEvery(function () {
            if (inProgress) {
                return;
            }
            if (getTime() - requestStartTime > getNewDelay(attempts)) {
                caller();
            }
        }, 10);
    });
}
exports.waitForImpl = waitForImpl;
function waitFor(f, getNewDelay) {
    return waitForImpl(setInterval, clearTimeout, function () { return new Date().getTime(); }, f, getNewDelay);
}
exports.waitFor = waitFor;
exports.default = waitFor;
