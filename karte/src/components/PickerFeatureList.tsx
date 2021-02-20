import React, { useCallback, useEffect, useState } from 'react';
import { List } from 'antd';
import { useDispatch } from 'react-redux';

import { FeatureDataEntity } from '../model/map';
import { resetFeatureData, setFeatureData } from '../store/map';

interface FeatureListProps {
	featureDataSet: FeatureDataEntity;
}

const PickerFeatureList = ({ featureDataSet }: FeatureListProps) => {
	const [selectedFeature, setSelectedFeature] = useState<string | undefined>();
	const dispatch = useDispatch();

	const onSelectFeature = useCallback(
		(featureLabel: string) => () => {
			setSelectedFeature(featureLabel);
			const { featureGroupName, featureName } = featureDataSet[featureLabel];
			dispatch(setFeatureData({ featureGroupNames: [featureGroupName], featureName }));
		},
		[dispatch, featureDataSet],
	);

	useEffect(() => {
		const featureLabelList: string[] = Object.keys(featureDataSet);
		const featureCount: number = featureLabelList.length;

		// feature가 1개인 경우는 바로 pick
		if (featureCount === 1) {
			const feature: string = featureLabelList[0];
			onSelectFeature(feature)();
		} else if (!selectedFeature) {
			dispatch(resetFeatureData());
		}
	}, [dispatch, featureDataSet, onSelectFeature, selectedFeature]);

	const renderItem = useCallback(
		(feature: string) => {
			return (
				<List.Item
					className={`${selectedFeature === feature ? 'selected-' : ''}item`}
					onClick={onSelectFeature(feature)}>
					<List.Item.Meta title={feature} />
				</List.Item>
			);
		},
		[onSelectFeature, selectedFeature],
	);

	return (
		<List
			itemLayout="horizontal"
			className="feature-list"
			dataSource={Object.keys(featureDataSet)}
			renderItem={renderItem}
		/>
	);
};

export default React.memo(PickerFeatureList);
