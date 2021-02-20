import React, { useCallback, useMemo } from 'react';
import { AllPropertyName } from '../../model/property';

interface ColorInputProps {
	value: string;
	disabled: boolean;
	property: AllPropertyName;
	onChangeColor: (color: string) => void;
}

const ColorInput = ({ value, disabled, property, onChangeColor }: ColorInputProps) => {
	const onChangeValue = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChangeColor(e.target.value);
		},
		[onChangeColor],
	);

	const colorClassName: string = useMemo(() => {
		if (!value) return `text-${property}`;

		const currentColor = parseInt(`0x${value.substring(1)}`, 16);
		const middleColor = 0x888888;
		const isBrightColor = currentColor > middleColor;

		return isBrightColor ? 'text-black' : 'text-white';
	}, [property, value]);

	return (
		<div className="color">
			<input
				type="color"
				className="color-input"
				disabled={disabled}
				value={value || '#FFFFFF'}
				onChange={onChangeValue}
			/>
			<div className={colorClassName}>{value ? value.toUpperCase() : property}</div>
		</div>
	);
};

export default React.memo(ColorInput);
