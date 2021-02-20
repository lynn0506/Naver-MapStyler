import {
	TabName,
	PropertyGroupName,
	LayerTypeName,
	PropertyInitialValueEntity,
	StylePropertyName,
	LayoutPropertyName,
	VisualPropertyName,
} from '../model/property';

const { GEOMETRY, ICON, LABEL } = TabName;
const { STYLE, LAYOUT, VISUAL } = PropertyGroupName;

const { FILL, STROKE, OPACITY, TEXT } = StylePropertyName;
const { TRANSLATE, ROTATE, SIZE } = LayoutPropertyName;
const { VISIBILITY, OVERLAP } = VisualPropertyName;

const { FILL_TYPE, LINE_TYPE, SYMBOL_TYPE } = LayerTypeName;

const layerPropertySiderData = {
	[GEOMETRY]: {
		[STYLE]: [FILL, STROKE, OPACITY],
		[LAYOUT]: [TRANSLATE],
		[VISUAL]: [VISIBILITY],
	},
	[ICON]: {
		[STYLE]: [FILL, STROKE, OPACITY],
		[LAYOUT]: [TRANSLATE, ROTATE, SIZE],
		[VISUAL]: [VISIBILITY, OVERLAP],
	},
	[LABEL]: {
		[STYLE]: [FILL, STROKE, OPACITY, TEXT],
		[LAYOUT]: [TRANSLATE, ROTATE, SIZE],
		[VISUAL]: [VISIBILITY, OVERLAP],
	},
} as const;

export const layerStyleListLayout = {
	isLineType: null,
	[FILL_TYPE]: {},
	[LINE_TYPE]: {},
	[SYMBOL_TYPE]: {},
};

export const propertyInitialValue: PropertyInitialValueEntity = {
	[STYLE]: { [FILL]: '', [STROKE]: '', [OPACITY]: null, [TEXT]: '' },
	[LAYOUT]: { [TRANSLATE]: { X: 0, Y: 0 }, [ROTATE]: 0, [SIZE]: null },
	[VISUAL]: { [VISIBILITY]: true, [OVERLAP]: false },
};

export default layerPropertySiderData;
