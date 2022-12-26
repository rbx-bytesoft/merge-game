import { OnStart, Service } from "@flamework/core";
import { Workspace } from "@rbxts/services";

const GRID_SIZE = 50;
const TILE_SIZE = 8;

const PRIMARY_COLOR = Color3.fromRGB(38, 97, 13);
const SECONDARY_COLOR = Color3.fromRGB(51, 122, 20);

@Service()
export class MapService implements OnStart {
	private _container = new Instance("Model");

	constructor() {
		this._container.Name = "Map";
		this._container.Parent = Workspace;
	}

	onStart() {
		print("Generating Map");

		// Creates a 100x100 tile map
		// Each tile is 5x5 studs and alternates between two different brick colors
		// The tile map is centred around Vector3.new(0, 0, 0)
		const halfSize = GRID_SIZE / 2;

		for (let x = -halfSize; x < halfSize; x++) {
			for (let z = -halfSize; z < halfSize; z++) {
				const tile = new Instance("Part");
				tile.Anchored = true;
				tile.CanCollide = true;
				tile.Size = new Vector3(TILE_SIZE, 1, TILE_SIZE);
				tile.Position = new Vector3(x * TILE_SIZE, 0, z * TILE_SIZE);
				tile.Material = Enum.Material.Grass;
				tile.Color =
					(x % 2 === 0 && z % 2 === 0) || (x % 2 !== 0 && z % 2 !== 0) ? PRIMARY_COLOR : SECONDARY_COLOR;

				tile.Parent = this._container;
			}
		}
	}
}
