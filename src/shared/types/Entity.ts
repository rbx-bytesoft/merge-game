// Valid attributes
export enum Attribute {
	Strength = "Strength",
	Agility = "Agility",
	Intelligence = "Intelligence",
}

// Attribute interface
export interface IAttribute {
	Base: number;
	Growth: number;
	// Run-time
	Current?: number;
}

// Attributes are stored in a table with attribute enum keys
export interface IAttributes {
	[Attribute.Strength]: IAttribute;
	[Attribute.Agility]: IAttribute;
	[Attribute.Intelligence]: IAttribute;
}

// Entity interface
export interface IEntity {
	// Optional
	Id?: string;
	Level?: number;
	Experience?: number;
	// Required
	Name: string;
	Health: number;
	HealthRegen: number;
	Mana: number;
	ManaRegen: number;
	Damage: number;
	PrimaryAttribute: Attribute;
	Attributes: IAttributes;
	MovementSpeed: number;
	AttackSpeed: number;
	AttackRange: number;
	Armor: number;
	MagicResistance: number;
}

// Entity config interface
export interface EntityConfig extends IEntity {
	Asset: Model;
}
