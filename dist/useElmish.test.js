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
const react_hooks_1 = require("@testing-library/react-hooks");
const index_1 = __importStar(require("./index"));
test("should act as a reducer", () => {
    const { result } = (0, react_hooks_1.renderHook)(() => (0, index_1.default)((prev, action) => {
        if (action == "increment") {
            return [prev + 1, index_1.Effects.none()];
        }
        else {
            return [prev, index_1.Effects.none()];
        }
    }, () => [0, index_1.Effects.none()]));
    (0, react_hooks_1.act)(() => {
        result.current[1]("increment");
    });
    expect(result.current[0]).toBe(1);
});
test("should execute effects", () => __awaiter(void 0, void 0, void 0, function* () {
    const { result, waitForNextUpdate } = (0, react_hooks_1.renderHook)(() => (0, index_1.default)((prev, action) => {
        if (action == "startSinging") {
            return [{ state: "singing" }, index_1.Effects.action("stopSinging")];
        }
        else if (action == "stopSinging") {
            return [{ state: "stoppedSinging" }, index_1.Effects.none()];
        }
        else {
            return [prev, index_1.Effects.none()];
        }
    }, () => [{ state: "notStartedSinging" }, index_1.Effects.none()]));
    (0, react_hooks_1.act)(() => {
        result.current[1]("startSinging");
    });
    expect(result.current[0].state).toBe("stoppedSinging");
}));
test("should not trigger rerender if no effects and state the same", () => __awaiter(void 0, void 0, void 0, function* () {
    let renderCount = 0;
    const { result } = (0, react_hooks_1.renderHook)(() => {
        ++renderCount;
        return (0, index_1.default)((prev, action) => {
            if (action == "increment") {
                return [prev + 1, index_1.Effects.none()];
            }
            else {
                return [prev, index_1.Effects.none()];
            }
        }, () => [0, index_1.Effects.none()]);
    });
    (0, react_hooks_1.act)(() => {
        result.current[1]("other");
    });
    expect(result.current[0]).toBe(0);
    expect(renderCount).toBe(2);
}));
test("initial effects should be executed", () => __awaiter(void 0, void 0, void 0, function* () {
    let renderCount = 0;
    const { result } = (0, react_hooks_1.renderHook)(() => {
        ++renderCount;
        return (0, index_1.default)((prev, action) => {
            if (action == "increment") {
                return [prev + 1, index_1.Effects.none()];
            }
            else {
                return [prev, index_1.Effects.none()];
            }
        }, () => [0, index_1.Effects.action('increment')]);
    });
    expect(result.current[0]).toBe(1);
}));
test("effects should only be executed once", () => __awaiter(void 0, void 0, void 0, function* () {
    var effectExecutionCount = 0;
    const { result } = (0, react_hooks_1.renderHook)(() => {
        return (0, index_1.default)((prev, action) => {
            if (action == "increment") {
                return [prev + 1, [() => { ++effectExecutionCount; }]];
            }
            else {
                return [prev, index_1.Effects.none()];
            }
        }, () => [0, index_1.Effects.none()]);
    });
    expect(result.current[0]).toBe(0);
    (0, react_hooks_1.act)(() => {
        result.current[1]("increment");
    });
    expect(result.current[0]).toBe(1);
    expect(effectExecutionCount).toBe(1);
}));
