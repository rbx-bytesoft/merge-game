import { Controller, OnInit, OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";

@Controller()
export class EntityController implements OnInit, OnStart {
	private _entities = Workspace.WaitForChild("Entities") as Folder;

	public onInit() {}

	public onStart() {
		const firstEntity: Model = (this._entities.GetChildren()[0] ?? this._entities.ChildAdded.Wait()[0]) as Model;
	}
}
