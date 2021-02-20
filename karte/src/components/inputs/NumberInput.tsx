import React from 'react';
import { InputNumber } from 'antd';

import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { AllPropertyName, InputParserType, NumberInputType } from '../../model/property';

interface NumberInputProps {
	value: number;
	placeholder?: AllPropertyName;
	size?: SizeType;
	min?: number;
	max?: number;
	step: number;
	formatter?: (value: NumberInputType) => string;
	parser?: (value: InputParserType) => string;
	onChangeNumber: (value: NumberInputType) => void;
}

const NumberInput = (props: NumberInputProps) => {
	const { value, placeholder, size, min, max, step, formatter, parser, onChangeNumber } = props;
	return (
		<InputNumber
			value={value}
			placeholder={placeholder}
			size={size}
			min={min}
			max={max}
			step={step}
			formatter={formatter}
			parser={parser}
			onChange={onChangeNumber}
		/>
	);
};

NumberInput.defaultProps = {
	step: 1,
	size: 'default',
};

export default React.memo(NumberInput);
