import type { EventController } from "./controller";
import { uuidv4 } from "../../shared/utils";

const eventPromises: Map<string, { response: (input: unknown) => void; reject: (error: unknown) => void }> = new Map();

onNet("__internal_server-nrpc-success", function (uuid: string, result: unknown) {
    eventPromises.get(uuid)?.response(result);
    eventPromises.delete(uuid);
});
onNet("__internal_server-nrpc-error", function (uuid: string, error: unknown) {
    eventPromises.get(uuid)?.reject(error);
    eventPromises.delete(uuid);
});

export function createServerEventProxy<T extends EventController>(namespace: string) {
    type ServerEventProxy = {
        [TEvent in keyof T]: (playerSrc: number) => (input: T[TEvent]["paramType"]) => Promise<T[TEvent]["returnType"]>;
    };

    const proxy = new Proxy(
        {},
        {
            get(_, prop: string) {
                return function eventWithId(targetSrc: number) {
                    return function sendEvent(input: unknown): Promise<unknown> {
                        let id = uuidv4();

                        while (eventPromises.has(id)) {
                            id = uuidv4(); // just in case. its always a chance
                        }

                        const promise = new Promise((response, reject) => eventPromises.set(id, { response, reject }));

                        emitNet(`__internal_client-nrpc-${namespace}-${prop}`, targetSrc, input, id);

                        return promise;
                    };
                };
            },
        }
    ) as ServerEventProxy;

    return proxy;
}
