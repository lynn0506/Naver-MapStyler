import { RefObject, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContext } from 'react-mapbox-gl';
import { Map, Style } from 'mapbox-gl';
import _ from 'lodash';

import { AppState } from '../store';
import {
	AllPropertyType,
	PropertyGroupName,
	AllPropertyName,
	PropertyValueEntity,
} from '../model/property';
import { propertyInitialValue } from '../assets/layerPropertySiderData';
import { getDefaultPropertyValue } from './map';
import { updateStyle } from '../store/map';
import { ButtonName } from '../model/store';

export const useProperty = (tabName: string, propertyGroupName: PropertyGroupName) => {
	const defaultStyle = useSelector((state: AppState) => state.map.defaultStyle);
	const dispatch = useDispatch();

	const [propertyValues, setPropertyValues] = useState<PropertyValueEntity>(
		propertyInitialValue[propertyGroupName],
	);
	const [isLineType, setIsLineType] = useState<boolean>(false);

	useEffect(() => {
		if (_.has(defaultStyle, [tabName, propertyGroupName])) {
			const defaultPropertyValue = getDefaultPropertyValue(
				defaultStyle[tabName],
				propertyGroupName,
			);
			setPropertyValues(defaultPropertyValue);

			if (_.has(defaultStyle, 'isLineType')) {
				setIsLineType(defaultStyle.isLineType as boolean);
			}
		}
	}, [tabName, propertyGroupName, defaultStyle]);

	const updatePropertyStyle = useMemo(
		() =>
			_.debounce((property: AllPropertyName, value: AllPropertyType) => {
				dispatch(updateStyle({ property, value }));
			}, 100),
		[dispatch],
	);

	const onChangeProperty = useCallback(
		(property: AllPropertyName) => (value: AllPropertyType) => {
			setPropertyValues((prev: PropertyValueEntity) => ({ ...prev, [property]: value }));
			updatePropertyStyle(property, value);
		},
		[updatePropertyStyle],
	);

	return { propertyValues, onChangeProperty, isLineType };
};

interface useCompareMapProps {
	baseMapRef: RefObject<HTMLDivElement>;
	baseMapStyle: Style | null;
	comparingMapRef: RefObject<HTMLDivElement>;
	comparingMapStyle: Style | null;
}

const { COMPARE, HISTORY } = ButtonName;

export const useCompareMap = (props: useCompareMapProps) => {
	const { baseMapRef, baseMapStyle, comparingMapRef, comparingMapStyle } = props;

	const currentMap = useContext<Map | undefined>(MapContext);

	const zoom = useSelector((state: AppState) => state.map.zoom);
	const center = useSelector((state: AppState) => state.map.center);
	const selectedMode = useSelector((state: AppState) => state.map.selectedMode);

	const [baseMap, setBaseMap] = useState<Map | null>(null);
	const [comparingMap, setComparingMap] = useState<Map | null>(null);

	// Set baseMap
	useEffect(() => {
		let baseMap: Map;
		if (selectedMode === COMPARE && baseMapStyle) {
			baseMap = new Map({
				container: baseMapRef.current as HTMLElement,
				style: baseMapStyle,
			});

			const currentZoom = currentMap ? currentMap.getZoom() : zoom;
			const currentCenter = currentMap ? currentMap.getCenter() : center;

			baseMap.setZoom(currentZoom);
			baseMap.setCenter(currentCenter);

			setBaseMap(baseMap);
		}

		return function cleanup() {
			baseMap?.remove();
		};
	}, [center, zoom, baseMapRef, currentMap, selectedMode, baseMapStyle]);

	// Set comparingMap
	useEffect(() => {
		let comparingMap: Map;
		if (selectedMode === HISTORY) {
			comparingMap = new Map({
				container: comparingMapRef.current as HTMLElement,
				style: '',
			});

			const currentZoom = currentMap ? currentMap.getZoom() : zoom;
			const currentCenter = currentMap ? currentMap.getCenter() : center;

			comparingMap.setZoom(currentZoom);
			comparingMap.setCenter(currentCenter);

			setComparingMap(comparingMap);
		}

		return function cleanup() {
			comparingMap?.remove();
		};
	}, [center, zoom, comparingMapRef, currentMap, selectedMode]);

	// Set history style
	useEffect(() => {
		if (selectedMode === HISTORY && comparingMapStyle) {
			comparingMap?.setStyle(comparingMapStyle);
		}
	}, [comparingMap, comparingMapStyle, selectedMode]);

	return selectedMode === COMPARE ? [baseMap, currentMap] : [currentMap, comparingMap];
};
