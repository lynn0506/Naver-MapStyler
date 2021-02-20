import { Style as MapboxStyleEntity } from 'mapbox-gl';
import _ from 'lodash';

import featureList from '../assets/featureSiderData';
import { layerStyleListLayout, propertyInitialValue } from '../assets/layerPropertySiderData';
import {
	AllPropertyType,
	LayerTypeName,
	TranslateType,
	TabName,
	SubPropertyName,
	StylePropertyName,
	AllPropertyName,
	PropertyGroupName,
	PropertyValueEntity,
	PropertyInitialValueEntity,
	LayoutPropertyName,
	VisualPropertyName,
} from '../model/property';
import {
	DefaultMapboxStyleEntity,
	FeatureDataEntity,
	FeatureLayerEntity,
	LabelEntity,
	PropertyEntity,
} from '../model/map';
import { StyleHistoryEntity } from '../model/store';

const { FILL_TYPE, LINE_TYPE, SYMBOL_TYPE } = LayerTypeName;
const { GEOMETRY, ICON, LABEL } = TabName;
const { PAINT_PROPERTY, LAYOUT_PROPERTY } = SubPropertyName;

const { FILL, STROKE, OPACITY, TEXT } = StylePropertyName;
const { TRANSLATE, ROTATE, SIZE } = LayoutPropertyName;
const { VISIBILITY, OVERLAP } = VisualPropertyName;

export const getLayersByFeatureName = (featureName: string) => {
	const layersList = Object.values(featureList).reduce(
		(acc, layers) => ({ ...acc, ...layers }),
		{},
	);

	return layersList[featureName];
};

export const loadStyleOfCurrentFeature = (
	mapboxStyle: MapboxStyleEntity,
	currentFeatureLayerList: FeatureLayerEntity[],
) => {
	const mapLayerData = mapboxStyle.layers;
	const currentFeatureStyleList: DefaultMapboxStyleEntity = _.cloneDeep(layerStyleListLayout);

	currentFeatureLayerList.forEach((stylingLayer) => {
		const layerData = mapLayerData?.find((layer: { id: string }) => layer.id === stylingLayer.id);

		currentFeatureStyleList[stylingLayer.type] = _.extend(
			currentFeatureStyleList[stylingLayer.type],
			_.get(layerData, 'paint'),
			_.get(layerData, 'layout'),
		);
	});

	const fillTypeLength = Object.keys(currentFeatureStyleList[FILL_TYPE]).length;
	const isLineType = fillTypeLength === 0;
	_.set(currentFeatureStyleList, 'isLineType', isLineType);

	return currentFeatureStyleList;
};

export const getLayerType = (tabName: string): string[] => {
	switch (tabName) {
		case GEOMETRY:
			return [FILL_TYPE, LINE_TYPE];
		case ICON:
		case LABEL:
			return [SYMBOL_TYPE];
		default:
			return [];
	}
};

const getPropertyNamePrefix = (tabName: string, layerType: string): string => {
	switch (tabName) {
		case GEOMETRY:
			return layerType === LINE_TYPE ? 'line' : 'fill';
		case ICON:
			return 'icon';
		case LABEL:
			return 'text';
		default:
			return '';
	}
};

export const getPropertyNamePostfix = (
	propertyName: AllPropertyName,
	layerType: string,
): string => {
	switch (propertyName) {
		case FILL:
			return 'color';
		case STROKE:
			return layerType === FILL_TYPE ? 'outline-color' : 'halo-color';
		case OVERLAP:
			return 'allow-overlap';
		case TEXT:
			return 'field';
		default:
			/* OPACITY, VISIBILITY, ROTATE, SIZE, PATTERN, IMAGE, TANSLATE */
			return propertyName.toLowerCase();
	}
};

export const getMapboxPropertyName = (
	tabName: string,
	propertyName: AllPropertyName,
	layerType: string,
) => {
	const prefix: string = getPropertyNamePrefix(tabName, layerType);
	const postfix: string = getPropertyNamePostfix(propertyName, layerType);
	return propertyName === VISIBILITY ? `${postfix}` : `${prefix}-${postfix}`;
};

export const pickStyleByPropertyName = (mapboxStyle: any, tabName: string) => (
	propertyName: AllPropertyName,
): AllPropertyType => {
	const isLineType = mapboxStyle?.isLineType;
	const layerTypeList = getLayerType(tabName);

	// eslint-disable-next-line no-nested-ternary
	const layerType = layerTypeList.length === 2 ? (isLineType ? LINE_TYPE : FILL_TYPE) : SYMBOL_TYPE;
	const mapboxPropertyName = getMapboxPropertyName(tabName, propertyName, layerType);

	return _.has(mapboxStyle, [layerType, mapboxPropertyName]) &&
		// TODO: Below line should be excluded when the property's **stops** list problem is handled
		!_.has(mapboxStyle[layerType][mapboxPropertyName], 'stops')
		? mapboxStyle[layerType][mapboxPropertyName]
		: null;
};

export const getSubPropertyOfLayer = (propertyName: AllPropertyName): 'paint' | 'layout' | '' => {
	if (Object([FILL, STROKE, OPACITY, TRANSLATE]).includes(propertyName)) return PAINT_PROPERTY;
	if (Object([VISIBILITY, ROTATE, SIZE, OVERLAP, TEXT]).includes(propertyName))
		return LAYOUT_PROPERTY;
	return '';
};

export const getFormattedMapboxStyleValue = (
	value: AllPropertyType,
	propertyName: AllPropertyName,
): AllPropertyType => {
	if (propertyName === TRANSLATE) {
		const translate = value as TranslateType;
		return [translate.X, -translate.Y];
	}
	if (propertyName === VISIBILITY) return value ? 'visible' : 'none';
	return value;
};

export const isInvalidInput = (value: AllPropertyType, propertyName: AllPropertyName): boolean => {
	if (propertyName === OPACITY) return typeof value !== 'number' || value <= 0 || value > 1;
	if (propertyName === TEXT) return typeof value !== 'string' && value !== null;
	if (Object([FILL, STROKE]).includes(propertyName)) return typeof value !== 'string';
	if (Object([ROTATE, SIZE]).includes(propertyName)) return typeof value !== 'number';
	if (Object([VISIBILITY, OVERLAP]).includes(propertyName)) return typeof value !== 'boolean';
	if (propertyName === TRANSLATE) {
		const translate = value as TranslateType;
		return typeof translate.X !== 'number' || typeof translate.Y !== 'number';
	}
	return true;
};

export const getFormattedHistoryLabelValue = (
	value: AllPropertyType,
	propertyName: AllPropertyName,
): AllPropertyType => {
	if (propertyName === ROTATE) return `${value}°`;
	if (propertyName === TRANSLATE) {
		const translate = value as TranslateType;
		return `[x:${translate.X}, y:${translate.Y}]`;
	}
	return value;
};

export const updateMapboxStyleByLayers = (
	mapboxStyle: MapboxStyleEntity,
	layers: FeatureLayerEntity[],
	tabName: string,
	property: AllPropertyName,
	value: AllPropertyType,
	featureLabelList?: LabelEntity[],
) => {
	layers.forEach((featureLayer: FeatureLayerEntity) => {
		const layer = mapboxStyle?.layers?.find((mapboxLayer) => mapboxLayer.id === featureLayer.id);
		if (!layer) return;
		if (Object(getLayerType(tabName as string)).includes(layer.type)) {
			/* subProperty: 1) layout 2) paint object */
			const subPropertyName = getSubPropertyOfLayer(property);
			const subProperty = _.get(layer, subPropertyName) as PropertyEntity;
			/* ex) 'fill-color' 'line-color' 'icon-rotate' 'text-filed' 'visibility' etc */
			const propertyName: string = getMapboxPropertyName(
				tabName as string,
				property,
				layer.type as string,
			);
			if (propertyName === 'line-halo-color') return;
			if (propertyName === 'text-field' && value === null) {
				const featureLabel = featureLabelList?.find(
					(featureLabel) => featureLabel.id === featureLayer.id,
				);
				const labelText = featureLabel ? featureLabel.label : '';
				subProperty[propertyName] = labelText;
				return;
			}
			if (propertyName === 'fill-outline-color') subProperty['fill-antialias'] = true as boolean;
			subProperty[propertyName] = getFormattedMapboxStyleValue(value, property) as any;
		}
	});
};

export const getMapboxStyleByHistory = (
	historyStyle: StyleHistoryEntity,
	mapboxStyle: MapboxStyleEntity,
) => {
	const newMapboxStyle = _.cloneDeep(mapboxStyle);

	Object.entries(historyStyle).forEach(([featureName, tabs]) => {
		const layers = getLayersByFeatureName(featureName);

		Object.entries(tabs).forEach(([tabName, properties]) => {
			Object.entries(properties).forEach(([property, value]) => {
				updateMapboxStyleByLayers(
					newMapboxStyle,
					layers,
					tabName,
					property as AllPropertyName,
					value,
				);
			});
		});
	});
	return newMapboxStyle;
};

export const rgbToHex = (rgb: string) => {
	const rgbList = rgb
		// Checkregexr.com/5lkm6 -> Replace every character except comma(,) and number
		.replace(/[^%,.\d]/g, '')
		.split(',')
		.slice(0, 3);

	const hexList = rgbList.map((color) => {
		const hex = parseInt(color, 10).toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	});

	return `#${hexList.join('')}`;
};

export const getFormattedInputValue = (
	property: AllPropertyName,
	value: AllPropertyType,
): AllPropertyType => {
	if (property === FILL || property === STROKE) {
		if (_.isString(value) && value.startsWith('rgb')) return rgbToHex(value);
	}
	if (property === TRANSLATE) {
		const translate = value as [number, number];
		return { X: translate[0], Y: -translate[1] };
	}
	if (property === VISIBILITY) {
		return value === 'visible';
	}
	if (property === TEXT) {
		if (_.isString(value) && value.includes('{')) return '';
	}
	return value;
};

export const getDefaultPropertyValue = (
	defaultStyle: PropertyInitialValueEntity,
	propertyGroupName: PropertyGroupName,
): PropertyValueEntity => {
	const propertyValue: PropertyValueEntity = {};
	Object.entries(defaultStyle[propertyGroupName]).forEach(([property, value]) => {
		propertyValue[property as AllPropertyName] =
			value !== null
				? getFormattedInputValue(property as AllPropertyName, value)
				: propertyInitialValue[propertyGroupName][property as AllPropertyName];
	});
	return propertyValue;
};

export const loadOriginalLabelOfCurrentFeature = (
	featureName: string,
	mapboxStyle: MapboxStyleEntity,
) => {
	const mapLayerData = mapboxStyle.layers;

	const currentFeatureLayerList = getLayersByFeatureName(featureName);
	const labelList: LabelEntity[] = [];

	currentFeatureLayerList.forEach((stylingLayer) => {
		const layerData = mapLayerData?.find((layer) => layer.id === stylingLayer.id);

		if (_.has(layerData, ['layout', 'text-field'])) {
			labelList.push({
				id: stylingLayer.id,
				label: _.get(layerData, ['layout', 'text-field']),
			});
		}
	});

	return labelList;
};

export const getFeatureDataFromLayerIds = (layerIds: string[]) => {
	const featureDataSet: FeatureDataEntity = {};
	Object.entries(featureList).forEach(([featureGroupName, featureGroup]) => {
		Object.entries(featureGroup).forEach(([featureName, layers]) => {
			layers.forEach((layer: FeatureLayerEntity) => {
				if (layerIds.includes(layer.id)) {
					const label = `${featureGroupName}: ${featureName}` as string;
					featureDataSet[label] = { featureGroupName, featureName };
				}
			});
		});
	});
	return featureDataSet;
};

export const saveJsonFile = (content: string, fileName: string) => {
	const tempElement = document.createElement('a');
	const file = new Blob([content], { type: 'text/plain' });
	tempElement.href = URL.createObjectURL(file);
	tempElement.download = fileName;
	tempElement.click();
};
