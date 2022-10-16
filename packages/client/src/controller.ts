import { SupportedFunctions, EventController, EventDefinition } from "../../shared/ControllerTypes";
export * from "../../shared/ControllerTypes";

interface IClientControllerOptions {
    namespace: string;
}

export function event<T1 = any, T2 = any>(callback: SupportedFunctions<T1, T2>) {
    return {
        // These are only placeholders
        paramType: undefined,
        returnType: undefined,

        callback,
    } as EventDefinition<T1, T2>;
}

export function createEventController(options: IClientControllerOptions) {
    return function <T extends EventController>(events: T) {
        Object.entries(events).forEach(([eventName, eventDef]) => {
            onNet(
                `__internal_client-nrpc-${options.namespace}-${eventName}`,
                async function (input: unknown, callerUuid: string) {
                    try {
                        const result = await eventDef.callback(input);
                        emitNet(`__internal_server-nrpc-success`, callerUuid, result);
                    } catch (error) {
                        emitNet(`__internal_server-nrpc-error`, callerUuid, error);
                    }
                }
            );
        });

        return {} as T;
    };
}
