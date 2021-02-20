import { createAction, createReducer, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Style as MapboxStyleEntity } from 'mapbox-gl';
import _ from 'lodash';

import layerPropertySiderData from '../assets/layerPropertySiderData';
import { AllPropertyName, PropertyGroupName, TabName } from '../model/property';
import {
	getLayersByFeatureName,
	isInvalidInput,
	loadOriginalLabelOfCurrentFeature,
	loadStyleOfCurrentFeature,
	pickStyleByPropertyName,
	updateMapboxStyleByLayers,
} from '../utils/map';

import { ButtonName, FeaturePropsEntity, StyleChangePropsEntity } from '../model/store';
import { DefaultMapboxStyleEntity, FeatureLayerEntity, LabelEntity } from '../model/map';
import mapboxStyle from '../assets/naverStyle.json';
import { addHistory, updateHistory } from './history';
import { AppState } from '.';

const { GEOMETRY } = TabName;
const { STYLE } = PropertyGroupName;

const zoomLevel = 11.8;
const lng = 127.0246;
const lat = 37.5326;

const SET_FEATURE_GROUP_NAME = 'map/SET_FEATURE_GROUP_NAME' as const;
const SET_FEATURE_NAME = 'map/SET_FEATURE_NAME' as const;
const RESET_FEATURE_DATA = 'map/RESET_FEATURE_DATA' as const;
const SET_FEATURE_DEFAULT_STYLE = 'map/SET_FEATURE_DEFAULT_STYLE' as const;
const SET_TAB_NAME = 'map/SET_TAB_NAME' as const;
const SET_FEATURE_LABEL_LIST = 'map/SET_FEATURE_LABEL_LIST' as const;
const UPDATE_PROPERTY_STYLE = 'map/UPDATE_PROPERTY_STYLE' as const;
const UPDATE_MAPBOX_STYLE = 'map/UPDATE_MAPBOX_STYLE' as const;
const SET_SELECTED_MODE = 'map/SET_SELECTED_MODE' as const;
const RESET_SELECTED_MODE = 'map/RESET_SELECTED_MODE' as const;

type MapState = {
	defaultStyle: any;
	selectedFeatureGroups: string[];
	featureName: string | null;
	featureLayers: FeatureLayerEntity[];
	tabName: string | null;
	featureLabelList: LabelEntity[];
	mapboxStyle: MapboxStyleEntity;
	zoom: number;
	center: [number, number];
	selectedMode: ButtonName | null;
};

const initialState: MapState = {
	defaultStyle: {},
	selectedFeatureGroups: [],
	featureName: null,
	featureLayers: [],
	tabName: null,
	featureLabelList: [],
	mapboxStyle: mapboxStyle as MapboxStyleEntity,
	zoom: zoomLevel,
	center: [lng, lat],
	selectedMode: null,
};

export const setSelectedFeatureGroups = createAction<string[]>(SET_FEATURE_GROUP_NAME);
export const setFeatureName = createAction<string>(SET_FEATURE_NAME);
export const resetFeatureData = createAction(RESET_FEATURE_DATA);
export const setFeatureDefaultStyle = createAction(SET_FEATURE_DEFAULT_STYLE);
export const setTabName = createAction<string>(SET_TAB_NAME);
export const setFeatureLabelList = createAction(SET_FEATURE_LABEL_LIST);
export const updatePropertyStyle = createAction<StyleChangePropsEntity>(UPDATE_PROPERTY_STYLE);
export const updateMapboxStyle = createAction<MapboxStyleEntity>(UPDATE_MAPBOX_STYLE);
export const setSelectedMode = createAction<ButtonName>(SET_SELECTED_MODE);
export const resetSelectedMode = createAction(RESET_SELECTED_MODE);

export const setFeatureData = (props: FeaturePropsEntity) => (
	dispatch: Dispatch,
	getState: () => AppState,
) => {
	const { featureName: prevFeatureName } = getState().map;
	const { featureName: currentFeatureName, featureGroupNames } = props;
	if (prevFeatureName !== currentFeatureName) {
		dispatch(setSelectedFeatureGroups(featureGroupNames));
		dispatch(setFeatureName(currentFeatureName));
		dispatch(setFeatureDefaultStyle());
		dispatch(setFeatureLabelList());
	}
};

export const updateStyle = (props: StyleChangePropsEntity) => (
	dispatch: Dispatch,
	getState: () => AppState,
) => {
	dispatch(updatePropertyStyle(props));
	const { featureName, tabName } = getState().map;
	if (featureName && tabName) {
		dispatch(addHistory({ featureName, tabName, ...props }));
	}
};

export const applyHistoryMapboxStyle = (index: number) => (
	dispatch: Dispatch,
	getState: () => AppState,
) => {
	const { historyMapboxStyle } = getState().history;
	if (historyMapboxStyle) dispatch(updateMapboxStyle(historyMapboxStyle));
	dispatch(updateHistory(index));
};

export default createReducer(initialState, {
	[setSelectedFeatureGroups.type]: (state, action: PayloadAction<string[]>) => {
		state.selectedFeatureGroups = action.payload;
	},
	[setFeatureName.type]: (state, action: PayloadAction<string>) => {
		state.featureName = action.payload;
		state.featureLayers = getLayersByFeatureName(state.featureName);
		state.tabName = GEOMETRY;
	},
	[resetFeatureData.type]: (state) => {
		state.defaultStyle = {};
		state.featureName = null;
		state.selectedFeatureGroups = [];
		state.featureLayers = [];
		state.featureLabelList = [];
		state.tabName = null;
	},
	[setFeatureDefaultStyle.type]: (state) => {
		// Set defaultStyle to the corresponding featureName
		const defaultMapboxStyle: DefaultMapboxStyleEntity = loadStyleOfCurrentFeature(
			state.mapboxStyle as MapboxStyleEntity,
			state.featureLayers,
		);
		_.set(state.defaultStyle, [GEOMETRY, STYLE, 'isLineType'], defaultMapboxStyle.isLineType);

		Object.entries(layerPropertySiderData).forEach(([tabName, propertyGroups]) => {
			const newStyle = pickStyleByPropertyName(defaultMapboxStyle, tabName);

			Object.entries(propertyGroups).forEach(([propertyGroupName, properties]) => {
				properties.forEach((propertyName: AllPropertyName) => {
					const newPropertyStyle = newStyle(propertyName);
					_.set(state.defaultStyle, [tabName, propertyGroupName, propertyName], newPropertyStyle);
				});
			});
		});
	},
	[setTabName.type]: (state, action: PayloadAction<string>) => {
		state.tabName = action.payload;
	},
	[setFeatureLabelList.type]: (state) => {
		const { featureName } = state;
		if (featureName) {
			state.featureLabelList = loadOriginalLabelOfCurrentFeature(
				featureName,
				mapboxStyle as MapboxStyleEntity,
			);
		}
	},
	[setSelectedMode.type]: (state, action: PayloadAction<ButtonName>) => {
		state.selectedMode = action.payload;
	},
	[resetSelectedMode.type]: (state) => {
		state.selectedMode = null;
	},
	[updatePropertyStyle.type]: (state, action: PayloadAction<StyleChangePropsEntity>) => {
		const { property, value } = action.payload;
		if (isInvalidInput(value, property)) return;

		const { featureLayers, tabName, featureLabelList, mapboxStyle } = state;
		if (tabName == null) return;
		updateMapboxStyleByLayers(
			mapboxStyle as MapboxStyleEntity,
			featureLayers,
			tabName,
			property,
			value,
			featureLabelList,
		);
	},
	[updateMapboxStyle.type]: (state, action: PayloadAction<MapboxStyleEntity>) => {
		_.set(state, 'mapboxStyle', action.payload);
	},
	[setSelectedMode.type]: (state, action: PayloadAction<ButtonName>) => {
		state.selectedMode = action.payload;
	},
	[resetSelectedMode.type]: (state) => {
		state.selectedMode = null;
	},
});
