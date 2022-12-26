import Net, { Definitions } from "@rbxts/net";

import { IEntity } from "./types/Entity";

type EntityEvent = [uuid: string, data: IEntity];

const Remotes = Net.CreateDefinitions({
	Entity: Definitions.Namespace({
		StreamStarted: Definitions.ServerToClientEvent<EntityEvent>(),
		StreamEnded: Definitions.ServerToClientEvent<EntityEvent>(),
	}),
});

export = Remotes;
