import { createStore } from '@stencil/store';
import { getElement, type ComponentInterface } from '@stencil/core';

type Callback = (value: any, oldValue?: any) => void;

export function createStoreSync<StoreType extends Record<string, any>>(initialState: StoreType) {
  const store = createStore<StoreType>(initialState);

  const storeCallbacks = new Map<keyof StoreType, Set<Callback>>();

  store.on('set', (key, newValue, oldValue) => {
    const callbacks = storeCallbacks.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(newValue, oldValue));
    }
  });

  function addCallback(key: keyof StoreType, callback: Callback) {
    const callbacks = storeCallbacks.get(key) || new Set();
    callbacks.add(callback);
    storeCallbacks.set(key, callbacks);
  }

  function deleteCallback(key: keyof StoreType, callback: Callback) {
    const callbacks = storeCallbacks.get(key);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        storeCallbacks.delete(key);
      }
    }
  }

  function SyncWithStore() {
    return function (proto: ComponentInterface, propName: keyof StoreType) {
      let onChangeCallback: any;

      type ValueType = StoreType[keyof StoreType];

      const { connectedCallback, disconnectedCallback } = proto;

      proto.connectedCallback = function () {
        const host = getElement(this);
        const value = host[propName as string];

        if (!value) {
          const storeValue = store.state[propName];

          if (storeValue) {
            host[propName as string] = storeValue;
          }

          onChangeCallback = (newValue: ValueType, oldValue?: ValueType) => {
            const currentValue = host[propName as string];
            if (currentValue !== oldValue) {
              // remove callback since prop/state was changed manually
              deleteCallback(propName, onChangeCallback);
              onChangeCallback = undefined;
              return;
            }
            host[propName as string] = newValue;
          };

          addCallback(propName, onChangeCallback);
        }

        return connectedCallback?.call(this);
      };

      proto.disconnectedCallback = function () {
        deleteCallback(propName, onChangeCallback);
        return disconnectedCallback?.call(this);
      };
    };
  }

  return { store, SyncWithStore };
}
