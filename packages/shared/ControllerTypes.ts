export type EventController = { [events: string]: EventDefinition };

export type SupportedFunctions<T1 = any, T2 = any> = ((input: T1) => T2 | void) | (() => T2 | void);

export type EventDefinition<T1 = any, T2 = any> = {
    paramType: T1;
    returnType: T2;
    callback: SupportedFunctions<T1, T2>;
};
