import { createAction, createReducer, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Style as MapboxStyleEntity } from 'mapbox-gl';
import _ from 'lodash';

import { AddHistoryPropsEntity, HistoryEntity } from '../model/store';
import startStyle from '../assets/naverStyle.json';
import {
	getMapboxStyleByHistory,
	getFormattedHistoryLabelValue,
	isInvalidInput,
} from '../utils/map';
import { resetSelectedMode } from './map';

const ADD_HISTORY = 'history/SET_HISTORY_LIST' as const;
const SET_HISTORY_STYLE = 'history/SET_HISTORY_STYLE' as const;
const RESET_HISTORY_STYLE = 'history/RESET_HISTORY_STYLE' as const;
const UPDATE_HISTORY = 'history/UPDATE_HISTORY' as const;

type HistoryState = {
	historyList: HistoryEntity[];
	historyMapboxStyle: MapboxStyleEntity | null;
};

const initialHistoryState: HistoryState = {
	historyList: [
		{
			label: '0. 시작 스타일',
			style: {},
			property: null,
			value: null,
		},
	],
	historyMapboxStyle: null,
};

export const addHistory = createAction<AddHistoryPropsEntity>(ADD_HISTORY);
export const setHistoryStyle = createAction<number>(SET_HISTORY_STYLE);
export const resetHistoryStyle = createAction(RESET_HISTORY_STYLE);
export const updateHistory = createAction<number>(UPDATE_HISTORY);

export const resetHistoryMode = () => (dispatch: Dispatch) => {
	dispatch(resetHistoryStyle());
	dispatch(resetSelectedMode());
};

export default createReducer(initialHistoryState, {
	[addHistory.type]: (state, action: PayloadAction<AddHistoryPropsEntity>) => {
		const { featureName, tabName, property, value } = action.payload;
		const { historyList } = state;
		if (isInvalidInput(value, property)) return;

		const index = state.historyList.length;
		// 1. 아파트: Geometry Fill #F35976
		const historyLabel = `${index}. ${featureName}: ${tabName} ${property} ${getFormattedHistoryLabelValue(
			value,
			property,
		)}`;
		const style = _.cloneDeep(historyList[historyList.length - 1].style);
		_.set(style, [featureName, tabName, property], value);
		state.historyList.push({
			label: historyLabel,
			style,
			property,
			value,
		});
	},
	[setHistoryStyle.type]: (state, action: PayloadAction<number>) => {
		const historyIndex = action.payload;
		if (historyIndex < 0 || historyIndex >= state.historyList.length) return;
		const { style } = state.historyList[historyIndex];
		const newHistoryMapboxStyle = getMapboxStyleByHistory(style, startStyle as MapboxStyleEntity);
		_.set(state, 'historyMapboxStyle', newHistoryMapboxStyle);
	},
	[resetHistoryStyle.type]: (state) => {
		state.historyMapboxStyle = null;
	},
	[updateHistory.type]: (state, action: PayloadAction<number>) => {
		const newHistoryIndex = action.payload;
		state.historyList.splice(newHistoryIndex + 1);
	},
});
