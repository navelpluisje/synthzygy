import { Colors } from 'src/constants/enums';
import { toKebabCase } from './toKebabCase';

export const setCssColors = () => {
  const cssRoot: HTMLElement = document.querySelector(':root');
  Object.entries(Colors).forEach(([name, code]) => {
    const propName = toKebabCase(name);
    cssRoot.style.setProperty(propName, code as string);
  });
};
