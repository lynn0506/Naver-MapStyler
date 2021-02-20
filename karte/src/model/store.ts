import { AllPropertyType, AllPropertyName } from './property';

// store/map.ts
export interface FeaturePropsEntity {
	featureName: string;
	featureGroupNames: string[];
}

// store/map.ts
export interface StyleChangePropsEntity {
	property: AllPropertyName;
	value: AllPropertyType;
}

export enum ButtonName {
	COMPARE = 'Compare',
	PICKER = 'Picker',
	HISTORY = 'History',
}

// store/history.ts
export interface HistoryEntity {
	label: string;
	style: StyleHistoryEntity;
	property: AllPropertyName | null;
	value: AllPropertyType;
}

export interface StyleHistoryEntity {
	[featureName: string]: {
		[tabName: string]: {
			[property in AllPropertyName]?: AllPropertyType;
		};
	};
}

export interface AddHistoryPropsEntity extends StyleChangePropsEntity {
	featureName: string;
	tabName: string;
}
