import { ReplicatedStorage, CollectionService, HttpService } from "@rbxts/services";
import { deepCopy } from "@rbxts/object-utils";

import { Attribute, EntityConfig, IEntity } from "shared/types/Entity";
import Signal from "@rbxts/signal";

export class Entity {
	// Constructor params
	private _uuid: string;
	private _model?: Model;
	private _config: EntityConfig;

	// Has the entity been initialized?
	private _initialized = false;

	// Current properties
	private _level: number;
	private _experience: number;
	private _currentProps?: IEntity;

	// Signals
	public PropertyChanged = new Signal<<T extends keyof IEntity>(prop: T, value: IEntity[T]) => void>();

	constructor(uuid: string, config: EntityConfig) {
		// Deep copy config
		config = deepCopy(config);

		// Deconstruct params
		const {
			// Config
			Asset,
			// Properties
			Name,
			Health,
			HealthRegen,
			Mana,
			ManaRegen,
			Damage,
			PrimaryAttribute,
			Attributes,
			MovementSpeed,
			AttackSpeed,
			AttackRange,
			Armor,
			MagicResistance,
		} = config;

		// Assert UUID is defined
		assert(uuid, "Entity UUID is not defined");
		this._uuid = uuid;

		// Assert an Asset is defined
		assert(Asset, "Entity asset is not defined");

		// Assert that all params are not undefined
		assert(Name !== undefined, "Entity name is not defined");
		assert(Health !== undefined, "Entity health is not defined");
		assert(HealthRegen !== undefined, "Entity health regen is not defined");
		assert(Mana !== undefined, "Entity mana is not defined");
		assert(ManaRegen !== undefined, "Entity mana regen is not defined");
		assert(Damage !== undefined, "Entity damage is not defined");
		assert(Attributes !== undefined, "Entity attributes is not defined");
		assert(MovementSpeed !== undefined, "Entity movement speed is not defined");
		assert(AttackSpeed !== undefined, "Entity attack speed is not defined");
		assert(AttackRange !== undefined, "Entity attack range is not defined");
		assert(Armor !== undefined, "Entity armor is not defined");
		assert(MagicResistance !== undefined, "Entity magic resistance is not defined");

		// Assert primary attribute is defined
		assert(PrimaryAttribute !== undefined, "Entity primary attribute is not defined");

		// Assert that all attributes are defined
		assert(Attributes[Attribute.Strength] !== undefined, "Entity strength is not defined");
		assert(Attributes[Attribute.Agility] !== undefined, "Entity agility is not defined");
		assert(Attributes[Attribute.Intelligence] !== undefined, "Entity intelligence is not defined");

		// Assert that all attributes have base and growth values
		assert(Attributes[Attribute.Strength].Base !== undefined, "Entity strength base is not defined");
		assert(Attributes[Attribute.Strength].Growth !== undefined, "Entity strength growth is not defined");
		assert(Attributes[Attribute.Agility].Base !== undefined, "Entity agility base is not defined");
		assert(Attributes[Attribute.Agility].Growth !== undefined, "Entity agility growth is not defined");
		assert(Attributes[Attribute.Intelligence].Base !== undefined, "Entity intelligence base is not defined");
		assert(Attributes[Attribute.Intelligence].Growth !== undefined, "Entity intelligence growth is not defined");

		// Apply config
		this._config = config;
		this._level = 1;
		this._experience = 0;

		this.Spawn();
	}

	// Initialize 'current' properties from config whilst retaining some values

	private InitProps(): void {
		// Deconstruct config
		const {
			Name,
			Health,
			HealthRegen,
			Mana,
			ManaRegen,
			Damage,
			PrimaryAttribute,
			Attributes,
			MovementSpeed,
			AttackSpeed,
			AttackRange,
			Armor,
			MagicResistance,
		} = deepCopy(this._config);

		// Adjust property values to 'current' values
		Attributes[Attribute.Strength].Current = Attributes[Attribute.Strength].Base;
		Attributes[Attribute.Agility].Current = Attributes[Attribute.Agility].Base;
		Attributes[Attribute.Intelligence].Current = Attributes[Attribute.Intelligence].Base;

		// Set current properties
		this._currentProps = deepCopy({
			// From current class
			Level: this._level,
			Experience: this._experience,
			// From config
			Name,
			Health,
			HealthRegen,
			Mana,
			ManaRegen,
			Damage,
			PrimaryAttribute,
			Attributes,
			MovementSpeed,
			AttackSpeed,
			AttackRange,
			Armor,
			MagicResistance,
		}) as IEntity;
	}

	// Getters and setters

	public Get<P extends keyof IEntity>(property: P): Readonly<IEntity[P]> {
		// Assert that the entity is initialized
		assert(this._initialized && this._currentProps, "Entity properties are not initialized");

		// Assert that the property is defined
		assert(this._currentProps[property] !== undefined, `Entity property "${property}" is not defined`);

		return this._currentProps[property];
	}

	public Set<P extends keyof IEntity>(property: P, value: IEntity[P]): void {
		// Assert that the entity is initialized
		assert(this._initialized && this._currentProps, "Entity properties are not initialized");

		// Assert that the property is defined
		assert(this._currentProps[property] !== undefined, `Entity property "${property}" is not defined`);

		if (this._currentProps[property] === value) return;
		this._currentProps[property] = value;

		return this.PropertyChanged.Fire(property, value);
	}

	// Get other properties

	public GetConfig(): Readonly<IEntity> {
		return this._config;
	}

	public GetUUID(): Readonly<string> {
		return this._uuid;
	}

	public GetModel(): Model | undefined {
		return this._model;
	}

	public GetProperties(): Readonly<IEntity> {
		// Assert that the entity is initialized
		assert(this._initialized && this._currentProps, "Entity properties are not initialized");

		return deepCopy(this._currentProps);
	}

	// Methods

	// Spawn the Entity into the world
	public Spawn(): void {
		// Assert that the entity is not already initialized
		if (this._initialized) return warn("Entity is already initialized");

		const { Asset } = this._config;

		// Locate the entity folder
		const entityFolder = ReplicatedStorage.FindFirstChild("Entities") as Folder;

		// Clone the asset
		const model = Asset.Clone();
		model.Parent = entityFolder;

		// Set the model
		this._model = model;

		// Assign other properties to the model
		if (this._config.Id !== undefined) this._model.SetAttribute("Id", this._config.Id);
		this._model.Name = this._uuid;

		// Initialize 'current' properties
		this.InitProps();

		assert(this._currentProps, "Entity current properties are not defined");

		// Create a ROBLOX attribute for each current property & force update
		for (const [property, value] of pairs(this._currentProps)) this.PropertyChanged.Fire(property, value);

		// Add the entity tag
		CollectionService.AddTag(this._model, "Entity");

		// Set the entity as initialized
		this._initialized = true;
	}

	// Safely despawn the Entity
	public Despawn(): void {
		// Assert that the entity is initialized
		if (!this._initialized) return warn("Entity is not initialized");
	}

	// Level up the entity
	public LevelUp(): void {
		return this.Set("Level", this.Get("Level")! + 1);
	}
}
