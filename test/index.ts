import { Ready, waitForImpl } from '../src/index';
import test from 'tape';

interface LogItem {
    event: string;
    t: number;
}

test('success', function(assert) {

    let fCallCount = 0;
    let time = 21;
    let cleared = false;

    function finishRepeatUntil(n: NodeJS.Timeout) {
        cleared = true;
        clearInterval(n);
    }

    function repeatEvery(f: () => void, n: number): NodeJS.Timeout {
        return setInterval(
            () => {
                time = time + n + 1;
                f();
            },
            0
        );
    }

    function getTime() {
        return time;
    }

    function delay() {
        return 10;
    }

    function f(): Promise<Ready<string>> {
        fCallCount++;
        if (time < 50) {
            return Promise.resolve({ complete: false });
        }
        return Promise.resolve({ complete: true, value: "" + time });
    }

    const p = waitForImpl(repeatEvery, finishRepeatUntil, getTime, f , delay);
    p.then((n) => {
        assert.is(cleared, true);
        assert.is(typeof n, "string");
        assert.true((parseInt(n) >= 50) && (parseInt(n) <= 60));
        assert.is(fCallCount, 4)
        assert.end();
    }).catch((_e) => { assert.fail(); });

});


test('fail', function(assert) {

    let fCallCount = 0;
    let time = 21;
    let cleared = false;

    function finishRepeatUntil(n: NodeJS.Timeout) {
        cleared = true;
        clearInterval(n);
    }

    function repeatEvery(f: () => void, n: number): NodeJS.Timeout {
        return setInterval(
            () => {
                time = time + n + 1;
                f();
            },
            0
        );
    }

    function getTime() {
        return time;
    }

    function delay() {
        return 10;
    }

    function f(): Promise<Ready<number>> {
        fCallCount++;
        if (time < 50) {
            return Promise.resolve({ complete: false });
        }
        throw new Error("Erm");
    }

    const p = waitForImpl(repeatEvery, finishRepeatUntil, getTime, f , delay);
    p.catch((e) => {
        assert.is(cleared, true);
        assert.is(e.message, "Erm");
        assert.true((time >= 50) && (time <= 60));
        assert.is(fCallCount, 4)
        assert.end();
    });

});
