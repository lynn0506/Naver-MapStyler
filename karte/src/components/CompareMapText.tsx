import React from 'react';

interface CompareMapTextPrpos {
	position: number;
	text: string;
}

const CompareMapText = ({ position, text }: CompareMapTextPrpos) => {
	const textKey = `${text}${position}`;

	return (
		<div
			key={textKey}
			className="compare-map-text"
			style={{
				left: `${position}px`,
			}}>
			{text}
		</div>
	);
};

export default CompareMapText;
