import React, { useCallback, useEffect, useState } from 'react';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Popup } from 'react-mapbox-gl';
import { CloseCircleFilled } from '@ant-design/icons';

import PickerFeatureList from '../../components/PickerFeatureList';
import { FeatureDataEntity } from '../../model/map';
import { getFeatureDataFromLayerIds } from '../../utils/map';

interface PickerContainerProps {
	mapFeatures: MapboxGeoJSONFeature[];
	coordinates: { lng: number; lat: number };
}

const PickerContainer = ({ mapFeatures, coordinates }: PickerContainerProps) => {
	const [featureDataSet, setFeatureDataSet] = useState<FeatureDataEntity>({});
	const [isPickerPopupOpened, setIsPickerPopupOpened] = useState<boolean>(true);

	const getFeatureDataOfMap = useCallback((mapFeatures: MapboxGeoJSONFeature[]) => {
		const layerIds: string[] = mapFeatures.map(({ layer }: MapboxGeoJSONFeature) => layer.id);
		const featureData = getFeatureDataFromLayerIds(layerIds);
		setFeatureDataSet(featureData);
	}, []);

	const onClosePickerPopup = useCallback(() => {
		setIsPickerPopupOpened(false);
	}, []);

	useEffect(() => {
		getFeatureDataOfMap(mapFeatures);
		setIsPickerPopupOpened(true);
	}, [getFeatureDataOfMap, mapFeatures]);

	return (
		<>
			{isPickerPopupOpened && (
				<Popup coordinates={[coordinates.lng, coordinates.lat]}>
					<div className="feature-list-header">
						<div className="title">Feature</div>
						<CloseCircleFilled className="close-button" onClick={onClosePickerPopup} />
					</div>
					<PickerFeatureList featureDataSet={featureDataSet} />
				</Popup>
			)}
		</>
	);
};

export default React.memo(PickerContainer);
