import { createClientEventProxy, createEventController, event } from "@nrpc/client";
import type { ServerController } from "@server/index";

//#region Client To server
const clientProxy = createClientEventProxy<ServerController>("server-test-controller");

async function main() {
    const players = await clientProxy.GetAllPlayers();
    console.log("Players on the server", players);

    await clientProxy.GreetFromClient("Hello nRPC");
}

main();

//#endregion

//#region Server To Client

function GetDistanceFrom(input: { x: number; y: number; z: number }) {
    const coords = GetEntityCoords(PlayerPedId(), false);
    return Math.sqrt((input.x - coords[0]) ** 2 + (input.y - coords[1]) ** 2 + (input.z - coords[2]) ** 2);
}

const clientController = createEventController({ namespace: "client-test-controller" })({
    GetDistanceFrom: event(GetDistanceFrom),
});

export type ClientController = typeof clientController;

//#endregion
