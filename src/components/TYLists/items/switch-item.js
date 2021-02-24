import React from 'react';
import ListItem from '../list-item';
import SwitchButton from '../../switch-button';
import { pick, omit } from './utils';

function SwitchItem({ value, disabled, ...props }) {
  const listItemPropNames = [
    'accessible',
    'accessibilityLabel',
    'accessibilityHint',
    'accessibilityComponentType',
    'accessibilityIgnoresInvertColors',
    'accessibilityRole',
    'accessibilityStates',
    'accessibilityTraits',
    'onFocus',
    'onBlur',
    'disabled',
    'onPress',
    'onPressIn',
    'onPressOut',
    'onLayout',
    'onLongPress',
    'nativeID',
    'testID',
    'delayPressIn',
    'delayPressOut',
    'delayLongPress',
    'pressRetentionOffset',
    'hitSlop',
    'activeOpacity',
    'hasTVPreferredFocus',
    'tvParallaxProperties',
    'styles',
    'theme',
    'arrow',
    'arrowColor',
    'arrowUseIcon',
    'actionDisabled',
    'title',
    'subTitle',
    'children',
    'imageFollowIconColor',
    'iconType',
    'actionType',
    'iconSize',
    'iconColor',
    'Icon',
    'Action',
    'needUpdate',
    'useART',
  ];
  const listItemProps = pick(props, listItemPropNames);
  const switchButtonProps = omit(props, listItemPropNames);
  return (
    <ListItem
      {...listItemProps}
      disabled={disabled}
      Action={<SwitchButton value={value} disabled={disabled} {...switchButtonProps} />}
    />
  );
}

SwitchItem.propTypes = {
  ...ListItem.propTypes,
  ...SwitchButton.propTypes,
};

export default SwitchItem;
