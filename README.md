# stencil-prop-store-sync

> A simple Stencil decorator for syncing `@Prop()` and `@State()` with a shared store — no more tedious prop drilling.

## ✨ What is it?

`stencil-prop-store-sync` provides a decorator to automatically sync Stencil component props and states with a shared store. This eliminates the need to manually pass common props like `size`, `theme`, or `locale` across multiple components.

### Before

```html
<my-button size="sm" />
<my-text-field size="sm" />
<my-header size="sm" />
<my-footer size="sm" />
```

### After

With store syncing, your components can access shared values automatically:

```html
<my-button />
<my-text-field />
<my-header />
<my-footer />
```

Just set the shared value once in your store, and all components will pick it up.

## 🛠️ Installation

```bash
npm install stencil-prop-store-sync
```

## 🚀 Quick Start

### 1. Create and export your store

```ts
// src/utils/store.ts
import { createStoreSync } from 'stencil-prop-store-sync';

export interface Store {
  name: string;
}

const { store, SyncWithStore } = createStoreSync<Store>({
  name: 'Vaibhav Shinde',
});

export { store, SyncWithStore };
```

### 2. Use the decorator in your component

```tsx
// src/components/my-component/my-component.tsx
import { Component, Prop } from '@stencil/core';
import { store, SyncWithStore } from '../../utils/store';

@Component({
  tag: 'my-component',
})
export class MyComponent {
  @SyncWithStore()
  @Prop()
  name: string;

  // You can now use this.name and it will stay in sync with the store
}
```

> ⚠️ Ensure the property name matches the key in your store, or TypeScript will throw an error.

## 📌 Notes

* You must initialize the store with values before using synced components.
* Syncing works for both `@Prop()` and `@State()` values.
* Ideal for design systems, shared config, or theme management.

## 📦 Example Use Case

Pass a common `size` value to all components in your design system:

```ts
// src/utils/store.ts
export interface Store {
  size: 'sm' | 'md' | 'lg';
}

const { store, SyncWithStore } = createStoreSync<Store>({
  size: 'md',
});
```

Then, use `@SyncWithStore()` wherever needed:

```ts
@SyncWithStore()
@Prop()
size: 'sm' | 'md' | 'lg';
```
