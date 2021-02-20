import React, { useCallback, useMemo } from 'react';
import { Col, Row, Slider } from 'antd';
import _ from 'lodash';

import { NumberInput } from '.';
import { NumberInputType, StylePropertyName } from '../../model/property';

interface SliderInputProps {
	min: number;
	max: number;
	step: number;
	value: number;
	onChangeSlider: (value: number) => void;
}

const SliderInput = (props: SliderInputProps) => {
	const { min, max, step, value, onChangeSlider } = props;

	const marks = useMemo(() => {
		const minInt = Math.floor(min);
		return {
			[minInt]: <p id="mark">{minInt.toString()}</p>,
			[max]: <p id="mark">{max.toString()}</p>,
		};
	}, [max, min]);

	const onChangeValue = useCallback(
		(value: NumberInputType) => {
			if (_.isNumber(value)) {
				onChangeSlider(value);
			}
		},
		[onChangeSlider],
	);

	return (
		<Row className="slider" justify="space-between">
			<Col span={16}>
				<Slider
					defaultValue={max}
					min={min}
					max={max}
					step={step}
					marks={marks}
					value={value}
					onChange={onChangeSlider}
					tooltipVisible={false}
				/>
			</Col>
			<Col className="slider-text" span={6}>
				<NumberInput
					value={value}
					size="small"
					min={min}
					max={max}
					step={step}
					placeholder={StylePropertyName.OPACITY}
					onChangeNumber={onChangeValue}
				/>
			</Col>
		</Row>
	);
};

SliderInput.defaultProps = {
	step: 0.01,
};

export default React.memo(SliderInput);
