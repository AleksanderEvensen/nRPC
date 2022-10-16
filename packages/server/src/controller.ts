import { SupportedFunctions, EventController, EventDefinition } from "../../shared/ControllerTypes";
export * from "../../shared/ControllerTypes";

interface IServerControllerOptions {
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

export function createEventController(options: IServerControllerOptions) {
    return function <T extends EventController>(events: T) {
        Object.entries(events).forEach(([eventName, eventDef]) => {
            onNet(
                `__internal_server-nrpc-${options.namespace}-${eventName}`,
                async function (input: unknown, callerUuid: string) {
                    const _src = +globalThis.source;
                    try {
                        const result = await eventDef.callback(input);
                        emitNet(`__internal_client-nrpc-success`, _src, callerUuid, result);
                    } catch (error) {
                        emitNet(`__internal_client-nrpc-error`, _src, callerUuid, error);
                    }
                }
            );
        });

        return {} as T;
    };
}
