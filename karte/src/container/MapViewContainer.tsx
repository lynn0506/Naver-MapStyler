import React, { useCallback, useEffect, useState } from 'react';
import { MapboxGeoJSONFeature, MapLayerMouseEvent } from 'mapbox-gl';
import ReactMapboxGL, { ZoomControl, MapContext } from 'react-mapbox-gl';
import { useSelector } from 'react-redux';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapScreenShot from '../components/MapScreenShot';
import { AppState } from '../store/index';
import CompareMapContainer from './mode/CompareMapContainer';
import PickerContainer from './mode/PickerContainer';
import SearchMapContainer from './SearchMapContainer';
import { ButtonName } from '../model/store';
import { MapCoordinatesEntity } from '../model/map';

const { COMPARE, HISTORY, PICKER } = ButtonName;

const token: string = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;
const Map = ReactMapboxGL({
	accessToken: token,
});

const MapViewContainer = () => {
	const zoom = useSelector((state: AppState) => state.map.zoom);
	const center = useSelector((state: AppState) => state.map.center);

	const mapboxStyle = useSelector((state: AppState) => state.map.mapboxStyle);
	const selectedMode = useSelector((state: AppState) => state.map.selectedMode);

	/* Picker Mode */
	const [coordinates, setCoordinates] = useState<MapCoordinatesEntity | null>(null);
	const [mapFeatures, setMapFeatures] = useState<MapboxGeoJSONFeature[]>([]);

	const onStyleLoad = useCallback(
		(map: any) => {
			map.setZoom(zoom);
			map.setCenter(center);
		},
		[center, zoom],
	);

	const onMapClick = useCallback((map: any) => {
		map.once('click', (e: MapLayerMouseEvent) => {
			const mapFeatures = map.queryRenderedFeatures(e.point);
			setMapFeatures(mapFeatures);
			setCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
		});
	}, []);

	useEffect(() => {
		if (selectedMode !== PICKER) {
			setCoordinates(null);
		}
	}, [selectedMode]);

	return (
		<Map
			style={mapboxStyle}
			containerStyle={{
				height: '100vh',
				width: '100vw',
			}}
			onClick={selectedMode === PICKER ? onMapClick : undefined}
			onStyleLoad={onStyleLoad}>
			<>
				{selectedMode === PICKER && coordinates !== null && (
					<PickerContainer coordinates={coordinates} mapFeatures={mapFeatures} />
				)}
				{(selectedMode === HISTORY || selectedMode === COMPARE) && <CompareMapContainer />}
			</>
			<MapContext.Consumer>{(map) => <SearchMapContainer map={map} />}</MapContext.Consumer>
			<MapScreenShot />
			<ZoomControl position="bottom-right" className="zoom-control" />
		</Map>
	);
};

export default React.memo(MapViewContainer);
