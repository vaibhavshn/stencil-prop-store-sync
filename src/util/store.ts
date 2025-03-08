import { createStoreSync } from '../lib';

export interface User {
  name: string;
}

export interface Data {
  token: string;
}

export interface Store {
  user: User;
  data: Data;
}

const { store, SyncWithStore } = createStoreSync<Store>({
  user: { name: 'Vaibhav Shinde' },
  data: undefined,
});

export { store, SyncWithStore };
