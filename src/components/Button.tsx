import React, { CSSProperties } from 'react';
import { getColors } from '../colors';

type Props = {
  onClick: () => void;
  selected: boolean;
  style?: CSSProperties;
};

const Button: React.FC<Props> = ({
  children,
  onClick,
  selected,
  style = {},
}) => {
  const { primary, secondary, white, black } = getColors();

  return (
    <button
      onClick={() => onClick()}
      style={{
        backgroundColor: selected ? primary : secondary,
        borderRadius: 4,
        padding: 10,
        color: selected ? white : black,
        border: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export { Button };
