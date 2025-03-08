import { createStore } from '@stencil/store';
import { getElement, type ComponentInterface } from '@stencil/core';

type Callback = (value: any, oldValue?: any) => void;

export function createStoreSync<S extends Record<string, any>>(initialState: S) {
  const store = createStore<S>(initialState);

  const storeCallbacks = new Map<keyof S, Set<Callback>>();

  store.on('set', (key, newValue, oldValue) => {
    const callbacks = storeCallbacks.get(key);
    console.log('running callbacks for', key);
    if (callbacks) {
      callbacks.forEach(callback => callback(newValue, oldValue));
    }
  });

  function addCallback(key: keyof S, callback: Callback) {
    const callbacks = storeCallbacks.get(key) || new Set();
    callbacks.add(callback);
    storeCallbacks.set(key, callbacks);
  }

  function deleteCallback(key: keyof S, callback: Callback) {
    const callbacks = storeCallbacks.get(key);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        storeCallbacks.delete(key);
      }
    }
  }

  function SyncWithStore() {
    return function (proto: ComponentInterface, propName: keyof S extends string ? keyof S : never) {
      let isUpdatingFromStore = false;
      let onChangeCallback: any;

      console.log('init syncstore for', propName, isUpdatingFromStore, onChangeCallback);

      type ValueType = S[keyof S];

      const { connectedCallback, disconnectedCallback } = proto;

      proto.connectedCallback = function () {
        const host = getElement(this);
        const value = host[propName as string];

        if (!value) {
          const storeValue = store.state[propName];

          if (storeValue) {
            isUpdatingFromStore = true;
            host[propName as string] = storeValue;
            isUpdatingFromStore = false;
          }

          onChangeCallback = (newValue: ValueType, oldValue?: ValueType) => {
            const currentValue = host[propName as string];
            if (currentValue !== oldValue) {
              // remove callback since prop/state was changed manually
              deleteCallback(propName, onChangeCallback);
              onChangeCallback = undefined;
              return;
            }
            isUpdatingFromStore = true;
            host[propName as string] = newValue;
            console.log(propName, isUpdatingFromStore);
            isUpdatingFromStore = false;
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
