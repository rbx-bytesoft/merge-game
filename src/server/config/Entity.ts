import { ServerStorage } from "@rbxts/services";
import { Attribute, EntityConfig } from "shared/types/Entity";

const ASSETS_PATH = ServerStorage.FindFirstChild("Assets") as Folder;
const ENTITIES_PATH = ASSETS_PATH.FindFirstChild("Entities") as Folder;

const getEntityAsset = (name: string): Model => {
	const asset = ENTITIES_PATH.FindFirstChild(name) as Model;
	assert(asset, `Entity asset ${name} does not exist`);

	return asset;
};

export const ENTITY_CONFIG: { [id: string]: EntityConfig } = {
	// NPC_DOTA_HERO_ABADDON
	npc_dota_hero_abaddon: {
		Name: "Abaddon",
		Asset: getEntityAsset("Bojack"),
		Health: 200,
		HealthRegen: 1,
		Mana: 75,
		ManaRegen: 0.25,
		Damage: 46,
		PrimaryAttribute: Attribute.Strength,
		Attributes: {
			[Attribute.Strength]: {
				Base: 22,
				Growth: 2.6,
			},
			[Attribute.Agility]: {
				Base: 23,
				Growth: 1.5,
			},
			[Attribute.Intelligence]: {
				Base: 18,
				Growth: 2,
			},
		},
		MovementSpeed: 325,
		AttackSpeed: 120,
		AttackRange: 150,
		Armor: -1,
		MagicResistance: 0.25,
	},
};
