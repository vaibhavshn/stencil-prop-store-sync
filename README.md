# stencil-prop-store-sync

A Stencil decorator for synchronizing `@Prop()` and `@State()` changes with a store, so you don't have to worry about prop drilling.

## Why?

Usually when your users use your UI Kit, they would have to write each individual components and sometimes pass the same common props throughout their code, like this:

```html
<my-button size="sm" />
<my-text-field size="sm" />
<my-header size="sm" />
<my-footer size="sm" />
```

You would know that when you have lots of components like this, writing and managing all these props can be a pain.

But with this solution, you can simply pass the store to the component and it will automatically sync the props with the store.

```html
<my-button />
<my-text-field />
<my-header />
<my-footer />
```

Note that you will have to set the size values before using these components, which can be done in a provider function or just manually mutating the store.

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
