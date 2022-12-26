import { OnStart, Service } from "@flamework/core";
import { Workspace, Players, HttpService } from "@rbxts/services";

import Signal from "@rbxts/signal";
import Remotes from "shared/net";

import { ENTITY_CONFIG } from "../../config/Entity";
import { Entity } from "../../classes/Entity";

import { EntityConfig } from "shared/types/Entity";
import { EntityCreateParams } from "./Requests";

// Import entity remotes
const EntityRemotes = Remotes.Server.GetNamespace("Entity");

@Service()
export class EntityService implements OnStart {
	private _entities = new Map<string, Entity>();
	private _entityFolder = new Instance("Folder");

	// Signals
	public EntityAdded = new Signal<(entity: Entity) => void>();
	public EntityRemoving = new Signal<(entity: Entity) => void>();

	constructor() {
		// Create entity folder
		this._entityFolder.Name = "Entities";
		this._entityFolder.Parent = Workspace;
	}

	public createOne(params: EntityCreateParams): Entity {
		const { Id } = params;
		let { Props } = params;

		// If Config is a string, fetch from EntityConfig
		if (Id !== undefined) {
			Props = ENTITY_CONFIG[Id];
			Props.Id = Id;
		}

		// Generate UUID
		const uuid = HttpService.GenerateGUID(false);

		// Construct entity
		const entity = new Entity(uuid, Props as EntityConfig);
		const entityModel = entity.GetModel();

		assert(entityModel, "Entity model is not defined");

		// Parent entity to folder
		entityModel.Parent = this._entityFolder;

		// Index entity by UUID
		this._entities.set(uuid, entity);
		this.EntityAdded.Fire(entity);

		return entity;
	}

	public removeOne(entity: Entity): void {
		const entityModel = entity.GetModel();

		assert(entityModel, "Entity model is not defined");

		// Remove entity from folder
		entityModel.Destroy();

		// Remove entity from index
		this._entities.delete(entity.GetUUID());

		return this.EntityRemoving.Fire(entity);
	}

	/*
		Replicate entity to players
		TODO: Check if visible to player
	*/
	private startStream(players: Player[], entity: Entity): void {
		warn("Starting stream for players:", players);
		return EntityRemotes.Get("StreamStarted").SendToPlayers(players, entity.GetUUID(), entity.GetProperties());
	}

	private endStream(players: Player[], entity: Entity): void {
		warn("Ending stream for players:", players);
		return EntityRemotes.Get("StreamEnded").SendToPlayers(players, entity.GetUUID(), entity.GetProperties());
	}

	// Lifecycle

	public onInit() {
		this.EntityAdded.Connect((entity) => this.startStream(Players.GetPlayers(), entity));
		this.EntityRemoving.Connect((entity) => this.endStream(Players.GetPlayers(), entity));
	}

	public onStart() {
		// Stream entities to players
		Players.PlayerAdded.Connect((player) => {
			for (const [_, entity] of pairs(this._entities)) this.startStream([player], entity);
		});

		// Create test entity
		const entity = this.createOne({ Id: "npc_dota_hero_abaddon" });

		warn(entity);

		task.wait(6);
		entity.LevelUp();

		task.wait(6);
		this.removeOne(entity);
	}
}
