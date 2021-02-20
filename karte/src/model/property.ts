export enum TabName {
	GEOMETRY = 'Geometry',
	ICON = 'Icon',
	LABEL = 'Label',
}

export enum LayerTypeName {
	FILL_TYPE = 'fill',
	LINE_TYPE = 'line',
	SYMBOL_TYPE = 'symbol',
}

export enum SubPropertyName {
	PAINT_PROPERTY = 'paint',
	LAYOUT_PROPERTY = 'layout',
}

export enum PropertyGroupName {
	STYLE = 'Style',
	LAYOUT = 'Layout',
	VISUAL = 'Visual',
}

export enum StylePropertyName {
	FILL = 'Fill',
	STROKE = 'Stroke',
	OPACITY = 'Opacity',
	TEXT = 'Text',
}

export enum LayoutPropertyName {
	TRANSLATE = 'Translate',
	ROTATE = 'Rotate',
	SIZE = 'Size',
}

export enum VisualPropertyName {
	VISIBILITY = 'Visibility',
	OVERLAP = 'Overlap',
}

export interface StylePropertyEntity {
	Fill: string;
	Stroke: string;
	Opacity: number;
	Text: string;
}

export interface LayoutPropertyEntity {
	Translate: TranslateType;
	Rotate?: number;
	Size?: number;
}

export interface VisualPropertyEntity {
	Visibility: boolean;
	Overlap?: boolean;
}

export interface TranslateType {
	X: number;
	Y: number;
}

export type PropertyInitialValueEntity = {
	[propertyGroupName in PropertyGroupName]: PropertyValueEntity;
};

export type PropertyValueEntity = {
	[property in AllPropertyName]?: AllPropertyType;
};

export type NumberInputType = string | number | undefined | null;
export type InputParserType = string | undefined;

export type StylePropertyType = string | number | null;
export type LayoutPropertyType = NumberInputType | TranslateType | [number, number];
export type VisualPropertyType = boolean;

export type AllPropertyName = StylePropertyName | LayoutPropertyName | VisualPropertyName;
export type AllPropertyType = StylePropertyType | LayoutPropertyType | VisualPropertyType;
