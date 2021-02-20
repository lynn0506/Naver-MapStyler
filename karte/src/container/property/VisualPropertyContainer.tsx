import React from 'react';
import { Card, Col, Row } from 'antd';

import { PropertyGroupName, VisualPropertyName } from '../../model/property';
import { SwitchInput } from '../../components/inputs/index';
import { useProperty } from '../../utils/hooks';

interface VisualPropertyContainerProps {
	tabName: string;
	properties: VisualPropertyName[];
}

const { VISIBILITY, OVERLAP } = VisualPropertyName;

const VisualPropertyContainer = ({ tabName, properties }: VisualPropertyContainerProps) => {
	const { propertyValues: visualProperty, onChangeProperty } = useProperty(
		tabName,
		PropertyGroupName.VISUAL,
	);

	return (
		<>
			{properties.map((property: VisualPropertyName) => (
				<Card bordered={false} key={`${tabName}${property}`}>
					<Row align="middle">
						<Col span={10}>{property}</Col>
						<Col span={8}>
							{(property === VISIBILITY || property === OVERLAP) && (
								<SwitchInput
									checked={visualProperty[property] as boolean}
									onChangeSwitch={onChangeProperty(property)}
								/>
							)}
						</Col>
					</Row>
				</Card>
			))}
		</>
	);
};

export default React.memo(VisualPropertyContainer);
