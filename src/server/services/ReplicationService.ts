import { Service, OnStart, OnInit } from "@flamework/core";

import { VisionService } from "./VisionService";
import { EntityService } from "./EntityService";

@Service({})
// Still thinking about how to implement this - should still be useful
// Ideally call into VisionService to get a list of players to replicate to
// Inject all services here to avoid circular dependencies
// General flow: class added => observe visibility => replicate to valid players
export class ReplicationService implements OnStart, OnInit {
	constructor(private readonly visionService: VisionService, private readonly entityService: EntityService) {}

	public onInit() {}

	public onStart() {}
}
