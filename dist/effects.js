"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = exports.fromIterator = exports.attemptFunction = exports.fromFunction = exports.dispatchFromFunction = exports.attemptPromise = exports.dispatchFromPromise = exports.fromPromise = exports.action = exports.delay = exports.none = void 0;
function none() {
    return [];
}
exports.none = none;
function delay(action, delay) {
    return [dispatch => setTimeout(() => dispatch(action), delay)];
}
exports.delay = delay;
function action(action) {
    return [dispatch => dispatch(action)];
}
exports.action = action;
function fromPromise(promise, ofSuccess, ofError) {
    return effectFromPromise(promise, ofSuccess, ofError);
}
exports.fromPromise = fromPromise;
function dispatchFromPromise(promise, ofError) {
    return effectFromPromise(promise, (x) => x, ofError);
}
exports.dispatchFromPromise = dispatchFromPromise;
function attemptPromise(promise, ofError) {
    return effectFromPromise(promise, ofError);
}
exports.attemptPromise = attemptPromise;
function effectFromPromise(promise, ofSuccess, ofError) {
    const handleError = ofError === undefined
        ? ofSuccess
        : ofError;
    const handleSuccess = ofError === undefined
        ? undefined
        : ofSuccess;
    return [
        (dispatch) => (promise()
            .then(value => {
            if (handleSuccess !== undefined) {
                dispatch(handleSuccess(value));
            }
        })
            .catch(error => {
            dispatch(handleError(error));
        }))
    ];
}
function dispatchFromFunction(f, ofError) {
    return effectFromFunction(f, (x) => x, ofError);
}
exports.dispatchFromFunction = dispatchFromFunction;
function fromFunction(f, ofSuccess, ofError) {
    return effectFromFunction(f, ofSuccess, ofError);
}
exports.fromFunction = fromFunction;
function attemptFunction(f, ofError) {
    return effectFromFunction(f, ofError);
}
exports.attemptFunction = attemptFunction;
function effectFromFunction(f, ofSuccess, ofError) {
    const handleError = ofError === undefined
        ? ofSuccess
        : ofError;
    const handleSuccess = ofError === undefined
        ? undefined
        : ofSuccess;
    return [
        (dispatch) => {
            try {
                const value = f();
                if (handleSuccess !== undefined) {
                    dispatch(handleSuccess(value));
                }
            }
            catch (error) {
                dispatch(handleError(error));
            }
        }
    ];
}
function fromIterator(iterator) {
    return [
        dispatch => {
            for (const action of iterator) {
                dispatch(action);
            }
        }
    ];
}
exports.fromIterator = fromIterator;
function combine(...effects) {
    return effects.reduce((prev, effect) => [...prev, ...effect], []);
}
exports.combine = combine;
