# stencil-prop-store-sync

A Stencil decorator that synchronizes a component's properties with a Stencil Store.

## Usage

In another file, create the store and get the decorator and export both.

```ts
// src/utils/store.ts
import { createStoreSync } from '../lib';

export interface Store {
  name: string;
}

const { store, SyncWithStore } = createStoreSync<Store>({
  name: 'Vaibhav Shinde',
});

export { store, SyncWithStore };
```

In your component, import the decorator and use it on the properties or even states that you want to sync.
Make sure the variable name and the store names match, else there will be a type error.

```tsx
// src/components/my-component/my-component.tsx
import { Component, Prop } from '@stencil/core';
import { store, SyncWithStore } from '../../utils/store';

@Component({
  tag: 'my-component',
})
export class MyComponent {
  /** My prop */
  @SyncWithStore()
  @Prop()
  name: string;

  // ...
}
```
