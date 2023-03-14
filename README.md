Hishim
=====
[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) Shim for non-browser env

---

# Installation
```shell
npm i hishim
```

# Usage
```js
import History from 'hishim'

const history = new History({
	handleBack(oldCurrent, newCurrent, next) {...},
	handleForward(oldCurrent, newCurrent, next) {...},
	handlePushState(oldCurrent, newCurrent, next) {...},
	handleReplaceState(oldCurrent, newCurrent, next) {...}
})
```

```ts
interface CurrentState {
	state: any, // your state
	idx: number, // index of the current state
	url: string, // url of this state
	title: string, // page title of this state
	prev: CurrentState, // previous state
	next: Current // next state
}
```

# License
MIT
