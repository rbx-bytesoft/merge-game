import { Controller, OnStart, OnInit } from "@flamework/core";

@Controller({})
export class MyController implements OnStart, OnInit {
	onInit() {}

	onStart() {
		print("MyController started");
	}
}
