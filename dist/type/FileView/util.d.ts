export declare function rafThrottle(fn: Function): <T>(this: T, ...args: any[]) => void;
type CustomSizeObj = {
    width: number;
    height: number;
};
export declare function getContainWH(containerSize: CustomSizeObj, elementSize: CustomSizeObj): CustomSizeObj | undefined;
export {};
