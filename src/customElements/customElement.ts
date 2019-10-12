/**
 * Borrowed some stuff from: https://github.com/geocine/custom-elements-ts/blob/master/src/custom-element.ts
 */

import { CustomElementConfig } from '../interfaces';

const validateSelector = (selector: string): void => {
  if (selector.indexOf('-') <= 0) {
    throw new Error('You need at least 1 dash in the custom element name!');
  }
};

export const CustomElement = (config: CustomElementConfig) => (
  (cls: any) => {
    validateSelector(config.selector);
    if (!config.template) {
      throw new Error('You need to pass a template for the element');
    }

    const customElement: any = class extends (cls as new () => any) {
      protected static connected: boolean = false;
      public showShadowRoot: boolean;

      constructor() {
        super();
        this.showShadowRoot = config.useShadow === undefined ? true : config.useShadow;
        if (!this.shadowRoot && this.showShadowRoot) {
          this.attachShadow({ mode: 'open' });
        }
      }

      public connectedCallback() {
        const template = document.createElement('template');
        const styleTag = `${config.style ? `<style>${config.style}</style>` : ''}`;
        template.innerHTML = `${styleTag}${config.template}`;

        (this.showShadowRoot ? this.shadowRoot : this).appendChild(document.importNode(template.content, true));

        super.connectedCallback && super.connectedCallback();
        customElement.connected = true;
      }
    };

    if (!customElements.get(config.selector)) {
      customElements.define(config.selector, customElement);
    }
    return customElement;
  }
);
