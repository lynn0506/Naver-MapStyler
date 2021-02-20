import { LayerTypeName, AllPropertyName } from './property';

export interface DataEntity {
	[key: string]: any;
}

export interface DefaultMapboxStyleEntity {
	isLineType: boolean | null;
	[property: string]: any;
}

export interface FeatureDataEntity {
	[label: string]: { featureGroupName: string; featureName: string };
}

export interface FeatureListEntity {
	[featureGroupName: string]: {
		[featureName: string]: FeatureLayerEntity[];
	};
}

export interface FeatureLayerEntity {
	type: LayerTypeName;
	id: string;
}

export interface PropertyEntity {
	[key: string]: DataEntity | string | number | boolean;
}

export type StyleEntity = {
	[propertyName in AllPropertyName]?: string;
};

export interface MapLayerEntity {
	id: string;
	paint: StyleEntity;
	layout: StyleEntity;
}

export interface MapCoordinatesEntity {
	lng: number;
	lat: number;
}

export interface LabelEntity {
	id: string;
	label: string;
}
