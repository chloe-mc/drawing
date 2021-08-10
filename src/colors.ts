type ColorType =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'alert'
  | 'white'
  | 'black';
type Colors = { [key in ColorType]: string };

const colors: Colors = {
  primary: 'aqua',
  secondary: 'lightgray',
  accent: 'orange',
  white: 'white',
  black: 'black',
  alert: 'red',
};

export const getColor = (type: ColorType): string => {
  return colors[type];
};

export const getColors = (): Colors => {
  return colors;
};
