import React from 'react';
import { Card } from 'antd';

import { PropertyGroupName, StylePropertyName } from '../../model/property';
import { ColorInput, SliderInput, TextInput } from '../../components/inputs';
import { useProperty } from '../../utils/hooks';

export interface StylePropertyContainerProps {
	tabName: string;
	properties: StylePropertyName[];
}

const { FILL, STROKE, OPACITY, TEXT } = StylePropertyName;

const StylePropertyContainer = ({ tabName, properties }: StylePropertyContainerProps) => {
	const { propertyValues: styleProperty, onChangeProperty, isLineType } = useProperty(
		tabName,
		PropertyGroupName.STYLE,
	);

	return (
		<>
			{properties.map(
				(property: StylePropertyName) =>
					(!isLineType || property !== STROKE) && (
						<Card bordered={false} key={`${tabName}${property}`}>
							{property}
							{(property === FILL || property === STROKE) && (
								<ColorInput
									disabled={false}
									property={property}
									value={styleProperty[property] as string}
									onChangeColor={onChangeProperty(property)}
								/>
							)}
							{property === OPACITY && (
								<SliderInput
									min={0.01}
									max={1}
									value={styleProperty[property] as number}
									onChangeSlider={onChangeProperty(property)}
								/>
							)}
							{/* TextInput의 initialValue 값은 layer의 initial value 따라 바꿔주기 */}
							{property === TEXT && (
								<TextInput
									value={styleProperty[property] as string}
									onChangeText={onChangeProperty(property)}
								/>
							)}
						</Card>
					),
			)}
		</>
	);
};

export default StylePropertyContainer;
