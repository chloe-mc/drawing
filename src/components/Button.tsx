import React, { CSSProperties } from 'react';

type Props = {
  onClick: () => void;
  style?: CSSProperties;
};

const Button: React.FC<Props> = ({ children, onClick, style = {} }) => {
  return (
    <button
      onClick={() => onClick()}
      style={{
        borderRadius: 4,
        padding: 10,
        border: 0,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export { Button };
