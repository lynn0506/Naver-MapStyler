import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Style } from 'mapbox-gl';

import CompareMapText from '../../components/CompareMapText';
import { AppState } from '../../store';
import { useCompareMap } from '../../utils/hooks';
import { ButtonName } from '../../model/store';
import startStyle from '../../assets/naverStyle.json';

const Compare = require('mapbox-gl-compare');

const { COMPARE, HISTORY } = ButtonName;

const CompareMapContainer = () => {
	const selectedMode = useSelector((state: AppState) => state.map.selectedMode);
	const historyMapboxStyle = useSelector((state: AppState) => state.history.historyMapboxStyle);

	const [baseMapStyle, setBaseMapStyle] = useState<Style | null>(null);
	const [comparingMapStyle, setComparingMapStyle] = useState<Style | null>(null);

	const [compareBarPosition, setCompareBarPosition] = useState<number>(780);
	const [compareMapTextVisible, setCompareMapTextVisible] = useState<boolean>(false);

	const comparingMapRef = useRef<HTMLDivElement>(null);
	const baseMapRef = useRef<HTMLDivElement>(null);
	const compareMapContainerRef = useRef<HTMLDivElement>(null);

	// Set each map style based on selectedMode
	useEffect(() => {
		if (selectedMode === COMPARE) {
			setBaseMapStyle(startStyle as Style);
		}
		if (selectedMode === HISTORY) {
			setComparingMapStyle(historyMapboxStyle);
		}
	}, [historyMapboxStyle, selectedMode]);

	const [baseMap, comparingMap] = useCompareMap({
		baseMapRef,
		baseMapStyle,
		comparingMapRef,
		comparingMapStyle,
	});

	const setCompareTextPosition = useCallback((e: { currentPosition: number }) => {
		setCompareMapTextVisible(true);
		setCompareBarPosition(e.currentPosition);
	}, []);

	useEffect(() => {
		let compareMap: typeof Compare;
		if (baseMap && comparingMap) {
			compareMap = new Compare(baseMap, comparingMap, compareMapContainerRef.current);
			// Set compare bar initial position
			compareMap.setSlider(compareBarPosition);
			compareMap.on('slideend', setCompareTextPosition);
		}

		return function cleanup() {
			compareMap?.remove();
		};
	}, [baseMap, compareBarPosition, comparingMap, setCompareTextPosition]);

	return (
		<>
			<div className="compare-map-container" ref={compareMapContainerRef}>
				{selectedMode === COMPARE && <div className="compare-map" ref={baseMapRef} />}
				{selectedMode === HISTORY && <div className="compare-map" ref={comparingMapRef} />}
			</div>
			{compareMapTextVisible && (
				<>
					<CompareMapText
						position={compareBarPosition - 150}
						text={selectedMode === HISTORY ? 'Current' : 'Start Style'}
					/>
					<CompareMapText
						position={compareBarPosition + 50}
						text={selectedMode === HISTORY ? 'History' : 'Current'}
					/>
				</>
			)}
		</>
	);
};

export default React.memo(CompareMapContainer);
