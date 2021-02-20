import React, { useCallback } from 'react';
import { Card, Col, Row } from 'antd';

import {
	NumberInputType,
	InputParserType,
	PropertyGroupName,
	TranslateType,
	LayoutPropertyName,
} from '../../model/property';
import { TranslateInput, NumberInput } from '../../components/inputs/index';
import { useProperty } from '../../utils/hooks';

interface LayoutPropertyContainerProps {
	tabName: string;
	properties: LayoutPropertyName[];
}

const { TRANSLATE, ROTATE, SIZE } = LayoutPropertyName;

const LayoutPropertyContainer = ({ tabName, properties }: LayoutPropertyContainerProps) => {
	const { propertyValues: layoutProperty, onChangeProperty } = useProperty(
		tabName,
		PropertyGroupName.LAYOUT,
	);

	const getNumberFormatter = useCallback((value: NumberInputType) => `${value}°`, []);

	const getNumberParser = useCallback(
		(value: InputParserType) => (value ? value.replace('°', '') : '0°'),
		[],
	);

	return (
		<>
			{properties.map((property: LayoutPropertyName) => (
				<Card bordered={false} key={`${tabName}${property}`}>
					<Row align="middle">
						<Col span={10}>{property}</Col>
						<Col span={8}>
							{property === SIZE && (
								<NumberInput
									value={layoutProperty[property] as number}
									placeholder={property}
									min={0.1}
									step={0.1}
									onChangeNumber={onChangeProperty(property)}
								/>
							)}
							{property === ROTATE && (
								<NumberInput
									value={layoutProperty[property] as number}
									min={-360}
									max={360}
									formatter={getNumberFormatter}
									parser={getNumberParser}
									onChangeNumber={onChangeProperty(property)}
								/>
							)}
						</Col>
					</Row>
					{property === TRANSLATE && (
						<TranslateInput
							translate={layoutProperty[property] as TranslateType}
							onChangeTranslate={onChangeProperty(property)}
						/>
					)}
				</Card>
			))}
		</>
	);
};

export default React.memo(LayoutPropertyContainer);
