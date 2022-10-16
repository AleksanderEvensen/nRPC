import { createEventController, createServerEventProxy, event } from "@nrpc/server";

//#region Client To Server
function GetAllPlayers(): number[] {
    return getPlayers().map((v) => +v);
}

function GreetFromClient(input: string) {
    const src = global.source;
    console.log(`Hello World from ${GetPlayerName(src.toString())}\nMessage: ${input}`);
}

const serverController = createEventController({ namespace: "server-test-controller" })({
    GetAllPlayers: event(GetAllPlayers),
    GreetFromClient: event(GreetFromClient),
});

export type ServerController = typeof serverController;
//#endregion

//#region Server To Client

import type { ClientController } from "@client/index";

const serverProxy = createServerEventProxy<ClientController>("client-test-controller");

RegisterCommand(
    "nrpc-test",
    async (src: number) => {
        const distance = await serverProxy.GetDistanceFrom(src)({ x: 10, y: 100, z: 10 });
        console.log(`Distance from x=10 y=100 z=10, is ${distance}`);
    },
    false
);

//#endregion
