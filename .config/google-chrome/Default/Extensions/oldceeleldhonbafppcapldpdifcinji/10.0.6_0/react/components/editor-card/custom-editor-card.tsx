import React, { forwardRef, useState } from "react";
import { Props } from "./editor-card";
import CustomCardBase, { CardBaseRef } from "../card-base/custom-card-base";
import type { CustomCardBaseProps } from "../card-base/custom-card-base";

const CustomEditorCard = forwardRef<CardBaseRef, Props>(function EditorCard(
	{
		initialContentProps,
		mode,
		root,
		forwardUpdateContentFn,
		forwardUpdateTextContextFn,
		forwardSetCardIdleFn,
		customEditorCard,
		...cardBaseProps
	},
	cardBaseRef
) {
	const [isToolboxSentenceNavigationVisible, onToolboxSentenceNavigationVisibilityChange] = useState(false);
	const [customProps, setCustomBaseCardProps] = useState<CustomCardBaseProps>({
		className: "",
		mode,
		onToolboxSentenceNavigationVisibilityChange,
	});

	return (
		<CustomCardBase {...cardBaseProps} {...customProps} ref={cardBaseRef}>
			{customEditorCard?.render?.({
				isToolboxSentenceNavigationVisible,
				initialContentProps,
				mode,
				root,
				forwardUpdateContentFn,
				forwardUpdateTextContextFn,
				forwardSetCardIdleFn,
				cardBaseProps,
				cardBaseRef,
				setCustomBaseCardProps,
			})}
		</CustomCardBase>
	);
});

export default CustomEditorCard;
