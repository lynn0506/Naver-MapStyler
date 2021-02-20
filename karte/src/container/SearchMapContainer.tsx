import React, { useCallback, useEffect, useState } from 'react';
import { EnvironmentFilled } from '@ant-design/icons';
import { Marker } from 'react-mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const token: string = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;

interface SearchMapContainerProps {
	map: any;
}

const geocoder = new MapboxGeocoder({
	accessToken: token,
	placeholder: '장소를 검색하세요.',
	limit: 30,
	marker: false,
});

const SearchMapContainer = ({ map }: SearchMapContainerProps) => {
	const [isSearchMode, setSearchMode] = useState<boolean>(false);
	const [coordinates, setCoordinates] = useState<number[] | null>(null);

	const addEventListenerForGeocoder = useCallback(() => {
		const geocoderSearchIcon = document.getElementsByClassName(
			'mapboxgl-ctrl-geocoder--icon-search',
		)[0];
		geocoderSearchIcon.addEventListener('click', () => {
			setSearchMode((prev) => !prev);
		});
	}, []);

	useEffect(() => {
		map.addControl(geocoder);
		geocoder.on('result', (e: { result: MapboxGeocoder.Result }) => {
			setCoordinates(e.result.geometry.coordinates);
		});
		addEventListenerForGeocoder();

		return function cleanup() {
			map?.removeControl(geocoder);
		};
	}, [addEventListenerForGeocoder, map]);

	useEffect(() => {
		if (!isSearchMode) {
			setCoordinates(null);
			geocoder.setInput('');
		}
		const geocoderElement: Element = document.getElementsByClassName('mapboxgl-ctrl-geocoder')[0];
		geocoderElement?.setAttribute('style', `width: ${isSearchMode ? '310px' : '43px'} !important`);
	}, [isSearchMode]);

	return (
		<>
			{coordinates && (
				<Marker coordinates={coordinates}>
					<EnvironmentFilled className="search-position" />
				</Marker>
			)}
		</>
	);
};

export default React.memo(SearchMapContainer);
