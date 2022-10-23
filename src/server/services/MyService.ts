import { Service, OnStart, OnInit } from "@flamework/core";

@Service({})
export class MyService implements OnStart, OnInit {
	onInit() {}

	onStart() {
		print("MyService started");
	}
}
