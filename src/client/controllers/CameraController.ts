import { Controller, OnStart, OnTick } from "@flamework/core";
import { Workspace, UserInputService } from "@rbxts/services";

// Camera Settings
const CAMERA_SPEED = 10;
const CAMERA_DISTANCE = 20;

// Calculated Camera Offset
const CAMERA_OFFSET = new Vector3(0, CAMERA_DISTANCE * 1.25, CAMERA_DISTANCE);

@Controller()
export class CameraController implements OnStart, OnTick {
	private _origin = new CFrame(0, 0, 0);
	private _currentCamera =
		Workspace.CurrentCamera ?? (Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0] as Camera);

	private updateCamera() {
		this._currentCamera.CameraType = Enum.CameraType.Scriptable;
		this._currentCamera.CFrame = new CFrame(this._origin.add(CAMERA_OFFSET).Position, this._origin.Position);
	}

	public onTick(dt: number) {
		this._origin = this._origin.add(
			new Vector3(
				(UserInputService.IsKeyDown(Enum.KeyCode.A) ? -1 : 0) +
					(UserInputService.IsKeyDown(Enum.KeyCode.D) ? 1 : 0),
				0,
				(UserInputService.IsKeyDown(Enum.KeyCode.W) ? -1 : 0) +
					(UserInputService.IsKeyDown(Enum.KeyCode.S) ? 1 : 0),
			).mul(CAMERA_SPEED * dt),
		);

		return this.updateCamera();
	}

	public onStart() {
		this.updateCamera();
	}
}
