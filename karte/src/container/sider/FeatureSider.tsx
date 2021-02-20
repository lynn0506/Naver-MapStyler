import React, { ReactText, useCallback } from 'react';
import { Layout, Menu, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import featureList from '../../assets/featureSiderData';
import { AppState } from '../../store';
import { setFeatureData, setSelectedFeatureGroups } from '../../store/map';

const { SubMenu, Item } = Menu;
const { Sider } = Layout;

const FeatureSider = () => {
	const currentFeatureName = useSelector((state: AppState) => state.map.featureName);
	const featureGroupNames = useSelector((state: AppState) => state.map.selectedFeatureGroups);
	const dispatch = useDispatch();

	const onChangeFeatureGroup = useCallback(
		(featureGroupList: ReactText[]) => {
			dispatch(setSelectedFeatureGroups(featureGroupList as string[]));
		},
		[dispatch],
	);

	const onClickFeatureName = useCallback(
		(e: { keyPath: ReactText[] }) => {
			const featureName = e.keyPath[0] as string;
			dispatch(setFeatureData({ featureName, featureGroupNames }));
		},
		[dispatch, featureGroupNames],
	);

	return (
		<Sider className="feature-sider" theme="light">
			<Row className="feature-sider-header">Feature List</Row>
			<Menu
				mode="inline"
				selectedKeys={currentFeatureName ? [currentFeatureName] : []}
				openKeys={featureGroupNames}
				onOpenChange={onChangeFeatureGroup}
				onClick={onClickFeatureName}
				className="feature-sider-content">
				{Object.entries(featureList).map(([featureGroupName, featureGroup]) => (
					<SubMenu key={featureGroupName} title={featureGroupName}>
						{Object.entries(featureGroup).map(([featureName]) => (
							<Item key={featureName}>{featureName}</Item>
						))}
					</SubMenu>
				))}
			</Menu>
		</Sider>
	);
};

export default React.memo(FeatureSider);
