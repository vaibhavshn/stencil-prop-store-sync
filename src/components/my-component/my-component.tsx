import { Component, Prop, h } from '@stencil/core';
import { type Data, store, SyncWithStore, type User } from '../../util/store';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * Name
   */
  @SyncWithStore()
  @Prop({ mutable: true })
  user: User;

  /**
   * Message
   */
  @SyncWithStore()
  @Prop({ mutable: true })
  data: Data;

  connectedCallback() {
    console.log('component connected');
  }

  disconnectedCallback() {
    console.log('disconnected');
  }

  render() {
    return (
      <div>
        <p>name: {JSON.stringify(this.user)}</p>
        <p>message: {JSON.stringify(this.data)}</p>

        <button
          onClick={() => {
            store.state.user = { name: '' + Math.random() };
            store.state.data = { token: '' + Math.random() };
          }}
        >
          Update from store
        </button>

        <button
          onClick={() => {
            this.user = { name: 'runtime-' + Math.random() };
            this.data = { token: 'runtime-' + Math.random() };
          }}
        >
          Update in runtime
        </button>
      </div>
    );
  }
}
