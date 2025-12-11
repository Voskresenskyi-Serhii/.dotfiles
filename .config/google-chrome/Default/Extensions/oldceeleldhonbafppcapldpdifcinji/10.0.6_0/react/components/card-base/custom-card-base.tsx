import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { elementFactory } from "../../index";
import { classes } from "../../../common/utils";
import ExtnConfig, { ConfigKey } from "../../../init/config";
import type { CardMode } from "../../../ts-types/common";
import { useUpdatePositionOnModeChange, useDeferInitialUpdatePosition } from "./hooks";

export type CardType = "wide" | "narrow";

export interface CustomCardBaseProps extends React.ComponentProps<ReturnType<typeof elementFactory>> {
	updatePosition?: (container: HTMLElement | null) => void;
	onToolboxSentenceNavigationVisibilityChange: (isVisible: boolean) => void;
	isHidden?: boolean;
	mode: CardMode | undefined;
}

export interface CardBaseRef {
	updatePosition: () => void;
	updateCardType: (cardType: CardType) => void;
	updateCanChangeMode: (newValue: boolean) => void;
	updateSentenceNavigationVisibility: (show: boolean) => void;
}

const LtCompCardBase = elementFactory("comp-card-base");

const extnPrefix = ExtnConfig.get(ConfigKey.EXTN_PREFIX);

const CustomCardBase = forwardRef<CardBaseRef, React.PropsWithChildren<CustomCardBaseProps>>(function CardBase(
	{ updatePosition, onToolboxSentenceNavigationVisibilityChange, children, isHidden, mode, ...containerProps },
	ref
) {
	const cardBaseRef = useRef<HTMLElement>(null);
	const dataModeAttr = mode ? { "data-qb-mode": mode } : undefined;

	const updateCardPosition = useCallback(() => {
		updatePosition?.(cardBaseRef.current);
	}, [updatePosition]);

	useImperativeHandle<object, CardBaseRef>(
		ref,
		() => ({
			updatePosition: updateCardPosition,
			updateCardType: () => undefined,
			updateCanChangeMode: () => undefined,
			updateSentenceNavigationVisibility: onToolboxSentenceNavigationVisibilityChange,
		}),
		[updateCardPosition]
	);

	useUpdatePositionOnModeChange(mode, updateCardPosition);
	useDeferInitialUpdatePosition(cardBaseRef.current, updateCardPosition);

	return (
		<LtCompCardBase
			{...containerProps}
			{...dataModeAttr}
			ref={cardBaseRef}
			className={classes(containerProps.className, isHidden && `${extnPrefix}-comp-card-base--hidden`)}
		>
			{children}
		</LtCompCardBase>
	);
});

export default CustomCardBase;
