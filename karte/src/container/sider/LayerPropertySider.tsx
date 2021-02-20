import React, { useCallback } from 'react';
import { Layout, Tabs, Menu, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { LeftOutlined } from '@ant-design/icons';

import layerPropertySiderData from '../../assets/layerPropertySiderData';
import StylePropertyContainer from '../property/StylePropertyContainer';
import VisualPropertyContainer from '../property/VisualPropertyContainer';
import LayoutPropertyContainer from '../property/LayoutPropertyContainer';
import { PropertyGroupName } from '../../model/property';
import { resetFeatureData, setTabName } from '../../store/map';

interface LayerPropertySiderProps {
	currentFeatureName: string | null;
	collapsed: boolean;
}

const { Sider } = Layout;
const { TabPane } = Tabs;
const { ItemGroup, Divider } = Menu;

const { STYLE, LAYOUT, VISUAL } = PropertyGroupName;

const LayerPropertySider = (props: LayerPropertySiderProps) => {
	const { currentFeatureName, collapsed } = props;
	const dispatch = useDispatch();

	const onTabClick = useCallback(
		(tabName: string) => {
			dispatch(setTabName(tabName));
		},
		[dispatch],
	);

	const onClickCloseSiderButton = useCallback(() => {
		dispatch(resetFeatureData());
	}, [dispatch]);

	return (
		<Sider
			width="300"
			collapsedWidth="0"
			collapsed={collapsed}
			theme="light"
			className="layer-property-sider">
			<Tabs key={currentFeatureName} centered onTabClick={onTabClick}>
				{Object.entries(layerPropertySiderData).map(([tab, propertyGroups]) => (
					<TabPane tab={tab} key={tab}>
						<Menu mode="inline" className="layer-property-sider-content">
							{Object.entries(propertyGroups).map(([name, items]) => (
								<ItemGroup key={name} title={name}>
									<Divider />
									{name === STYLE && <StylePropertyContainer tabName={tab} properties={items} />}
									{name === LAYOUT && <LayoutPropertyContainer tabName={tab} properties={items} />}
									{name === VISUAL && <VisualPropertyContainer tabName={tab} properties={items} />}
								</ItemGroup>
							))}
						</Menu>
					</TabPane>
				))}
			</Tabs>
			<Button
				className={`${collapsed ? 'hidden' : 'close-sider'}-button`}
				icon={<LeftOutlined />}
				onClick={onClickCloseSiderButton}
			/>
		</Sider>
	);
};

export default React.memo(LayerPropertySider);
