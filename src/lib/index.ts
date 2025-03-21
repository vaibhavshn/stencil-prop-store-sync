import { createStore } from '@stencil/store';
import { getElement, type ComponentInterface } from '@stencil/core';

/**
 * Creates a Stencil store instance as well as a typed `@SyncWithStore` decorator
 * that you can use to sync component properties with the store's state.
 * @param initialState The initial state of the store
 */
export function createStoreSync<
  StoreType extends {
    [key: string]: any;
  },
>(initialState: StoreType) {
  const store = createStore<StoreType>(initialState);

  const elementsMap = new Map<string, any[]>();

  store.use({
    set: (propName, newValue, oldValue) => {
      const elements = elementsMap.get(propName as string);
      if (elements) {
        elementsMap.set(
          propName as string,
          elements.filter(element => {
            const currentValue = element[propName];
            if (currentValue === oldValue) {
              element[propName] = newValue;
              return true;
            } else {
              return false;
            }
          }),
        );
      }
    },
  });

  function appendElement(propName: string, element: any) {
    const elements = elementsMap.get(propName);
    if (!elements) {
      elementsMap.set(propName, [element]);
    } else {
      elements.push(element);
    }
  }

  function removeElement(propName: string, element: any) {
    const elements = elementsMap.get(propName) || [];
    const index = elements.indexOf(element);
    if (index !== -1) {
      elements.splice(index, 1);
      elementsMap.set(propName, elements);
    }
  }

  /**
   * Decorator that syncs component properties with the store's state.
   * Use this right before you use the `@Prop()` or `@State()` decorator.
   * Make sure the name of the property matches the key in the store.
   */
  function SyncWithStore() {
    return function (proto: ComponentInterface, propName: keyof StoreType) {
      const { connectedCallback, disconnectedCallback } = proto;

      proto.connectedCallback = function () {
        const host = getElement(this);
        const value = host[propName as string];

        if (!value) {
          const storeValue = store.state[propName];
          host[propName as string] = storeValue;
          appendElement(propName as string, host);
        }

        return connectedCallback?.call(this);
      };

      proto.disconnectedCallback = function () {
        removeElement(propName as string, getElement(this));
        return disconnectedCallback?.call(this);
      };
    };
  }

  return { store, SyncWithStore };
}
