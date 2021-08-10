import React, { CSSProperties } from 'react';
import { Button } from './Button';
import { getColors } from '../colors';

type Props = {
  onClick: () => void;
  selected: boolean;
  style?: CSSProperties;
};

const ToggleButton: React.FC<Props> = ({
  children,
  onClick,
  selected,
  style = {},
}) => {
  const { primary, secondary, white, black } = getColors();

  return (
    <Button
      onClick={() => onClick()}
      style={{
        backgroundColor: selected ? primary : secondary,
        color: selected ? white : black,
        ...style,
      }}
    >
      {children}
    </Button>
  );
};

export { ToggleButton };
