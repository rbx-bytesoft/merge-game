import { IEntity } from "shared/types/Entity";

interface EntityCreateBaseParams {}

interface EntityCreateIdParams extends EntityCreateBaseParams {
	Id: string;
	Props?: never;
}

interface EntityCreatePropsParams extends EntityCreateBaseParams {
	Props: IEntity;
	Id?: never;
}

export type EntityCreateParams = EntityCreateIdParams | EntityCreatePropsParams;
