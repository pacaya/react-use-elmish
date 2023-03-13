"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effects = exports.useElmish = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("react");
const Effects = __importStar(require("./effects"));
exports.Effects = Effects;
const removeEffects = 0;
const domainAction = 1;
/* istanbul ignore next */
function throwIfNotNever(x) {
    if (!!x) {
        throw new TypeError(`Expected value ${x} to be of type "never"`);
    }
    return x;
}
function makeElmishReducer(reducer) {
    return ([prevState, prevEffects], action) => {
        switch (action[0]) {
            case 0: {
                const nextEffects = prevEffects.filter(x => !action[1].includes(x));
                return [prevState, nextEffects];
            }
            case 1: {
                const [nextState, newEffects] = reducer(prevState, action[1]);
                return [
                    nextState,
                    [...prevEffects, ...newEffects]
                ];
            }
            /* istanbul ignore next */
            default: {
                return throwIfNotNever(action[0]);
            }
        }
    };
}
function useElmish(reducer, initializer) {
    const memoizedReducer = (0, react_1.useCallback)(makeElmishReducer(reducer), [reducer]);
    const [[state, effects], dispatch] = (0, react_2.useReducer)(memoizedReducer, null, initializer);
    const subDispatch = react_1.default.useCallback((action) => dispatch([domainAction, action]), [dispatch]);
    (0, react_2.useEffect)(() => {
        if (effects.length > 0) {
            const eff = [...effects];
            dispatch([removeEffects, eff]);
            eff.forEach(x => x(subDispatch));
        }
    }, [effects]);
    return [state, subDispatch];
}
exports.useElmish = useElmish;
exports.default = useElmish;
