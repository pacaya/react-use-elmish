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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Effects = __importStar(require("./effects"));
describe("none()", () => {
    test("should be equal to []", () => {
        expect(Effects.none()).toEqual([]);
    });
});
describe("delay()", () => {
    test("should return a array containing a single function", () => {
        const effects = Effects.delay("FROG", 100);
        expect(effects[0]).toBeInstanceOf(Function);
        expect(effects).toHaveLength(1);
    });
    test("should call setTimeout with the specified time", () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        const delay = 100;
        const action = "FROG";
        const delayEffect = Effects.delay(action, delay)[0];
        const mockDispatch = jest.fn();
        delayEffect(mockDispatch);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delay);
        jest.runAllTimers();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(action);
    });
});
describe("action()", () => {
    test("should return a array containing a single function", () => {
        const effects = Effects.action("FROG");
        expect(effects[0]).toBeInstanceOf(Function);
        expect(effects).toHaveLength(1);
    });
    test("should call dispatch with the specified action", () => {
        jest.useFakeTimers();
        const action = "SHOEHORN";
        const actionEffect = Effects.action(action)[0];
        const mockDispatch = jest.fn();
        actionEffect(mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(action);
    });
});
describe("fromPromise()", () => {
    test("should return a array containing a single function", () => __awaiter(void 0, void 0, void 0, function* () {
        const effects = Effects.attemptPromise(() => Promise.reject("FROG"), () => "ERROR ACTION");
        expect(effects[0]).toBeInstanceOf(Function);
        expect(effects).toHaveLength(1);
    }));
    test("should invoke provided dispatch once promise has resolved", () => __awaiter(void 0, void 0, void 0, function* () {
        const action = "BOOTS & CATS";
        const effects = Effects.fromPromise(() => Promise.resolve(), () => action, () => "ERROR ACTION");
        const mockDispatch = jest.fn();
        yield effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    }));
    test("should invoke provided dispatch once promise has rejected", () => __awaiter(void 0, void 0, void 0, function* () {
        const effects = Effects.attemptPromise(() => Promise.reject("FROG"), () => "ERROR ACTION");
        const mockDispatch = jest.fn();
        yield effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    }));
    test("shouldn't invoke provided dispatch once promise has resolved " +
        "but ofSuccess handler wasn't provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const effects = Effects.attemptPromise(() => Promise.resolve("CATS"), () => "ERROR ACTION");
        const mockDispatch = jest.fn();
        yield effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
    }));
});
describe("dispatchFromPromise()", () => {
    test("should invoke returned action once promise has succeeded", () => __awaiter(void 0, void 0, void 0, function* () {
        const effects = Effects.dispatchFromPromise(() => __awaiter(void 0, void 0, void 0, function* () { return 1 + 2; }), () => -1);
        const mockDispatch = jest.fn();
        yield effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, 3);
    }));
});
describe("dispatchFromFunction()", () => {
    test("should invoke returned action once function has succeeded", () => {
        const effects = Effects.dispatchFromFunction(() => 1 + 2, () => -1);
        const mockDispatch = jest.fn();
        effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, 3);
    });
});
describe("fromFunction()", () => {
    test("should return input function in array containing single item", () => {
        const mockFn = jest.fn();
        const effects = Effects.attemptFunction(mockFn, () => "ERROR ACTION");
        expect(effects[0]).toBeInstanceOf(Function);
        expect(effects).toHaveLength(1);
    });
    test("should invoke provided dispatch once function has succeeded", () => {
        const action = "BOOTS & CATS";
        const effects = Effects.fromFunction(() => 1 + 2, () => action, () => "ERROR ACTION");
        const mockDispatch = jest.fn();
        effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    test("should invoke provided dispatch once promise has thrown exception", () => {
        const effects = Effects.attemptFunction(() => { throw "FROG"; }, () => "ERROR ACTION");
        const mockDispatch = jest.fn();
        effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    test("shouldn't invoke provided dispatch once function has succeeded " +
        "but ofSuccess handler wasn't provided", () => {
        const effects = Effects.attemptFunction(() => "CATS", () => "ERROR ACTION");
        const mockDispatch = jest.fn();
        effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(0);
    });
});
describe("fromIterator()", () => {
    test("should return a array containing a single function", () => {
        const effects = Effects.fromIterator([1, 2, 3]);
        expect(effects[0]).toBeInstanceOf(Function);
        expect(effects).toHaveLength(1);
    });
    test("should dispatch each item in iterable array when invoked", () => {
        const effects = Effects.fromIterator([1, 2, 3]);
        const mockDispatch = jest.fn();
        effects[0](mockDispatch);
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, 1);
        expect(mockDispatch).toHaveBeenNthCalledWith(2, 2);
        expect(mockDispatch).toHaveBeenNthCalledWith(3, 3);
    });
});
describe("combine()", () => {
    test("should concatenate two effects together", () => {
        const effect1 = Effects.fromIterator([1, 2, 3]);
        const effect2 = Effects.action(4);
        const effects = Effects.combine(effect1, effect2);
        expect(effects[0]).toBeInstanceOf(Function);
        expect(effects[1]).toBeInstanceOf(Function);
        expect(effects).toHaveLength(2);
    });
});
