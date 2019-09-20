import { toKebabCase } from './toKebabCase';
import { Colors } from 'src/constants/enums';

export const setCssColors = () => {
  const cssRoot: HTMLElement = document.querySelector(':root')
  Object.entries(Colors).forEach(([name, code]) => {
    const propName = toKebabCase(name)
    cssRoot.style.setProperty(propName, <string>code)
  })
}