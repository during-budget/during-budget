import { PropsWithChildren } from 'react';
import classes from './Icon.module.css';

const DEFAULT_SIZE = '3rem';
const DEFUALT_FONT_SIZE = '1.75rem';
const DEFUALT_BORDER_RADIUS = '50%';
const DEFAULT_SQUARE_BORDER_RADIUS = '0.5rem';

interface IconProps {
  className?: string;
  size?: string;
  fontSize?: string;
  borderRadius?: string;
  isSquare?: boolean;
}

function Icon(props: PropsWithChildren<IconProps>) {
  const width = props.size || DEFAULT_SIZE;
  const height = props.size || DEFAULT_SIZE;
  const fontSize = props.fontSize || DEFUALT_FONT_SIZE;
  const borderRadius =
    props.borderRadius ||
    (props.isSquare ? DEFAULT_SQUARE_BORDER_RADIUS : DEFUALT_BORDER_RADIUS);
  return (
    <span
      className={`${classes.container} ${props.className ? props.className : ''}`}
      style={{ width, height, fontSize, borderRadius }}
    >
      {props.children}
    </span>
  );
}

export default Icon;
