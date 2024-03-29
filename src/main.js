const History = class History {
	constructor(handlers = {}, env = {}) {
		this.__handlers = handlers
		this.__env = env
		this.__length = 0
		this.__current = {
			state: null,
			idx: -1,
			title: null,
			url: null,
			prev: null,
			next: null
		}

		// does nothing for now
		this.scrollRestoration = 'auto'
	}

	__emitPopState() {
		const globalObj = this.__env.global || globalThis
		const onpopstate = globalObj.onpopstate || globalThis.onpopstate

		if (!onpopstate) return

		const Event = globalObj.Event || globalThis.Event

		if (!Event) return

		const popStateEvent = new Event('popstate')

		onpopstate(popStateEvent)
	}

	get state() {
		return this.__current.state
	}

	get length() {
		return this.__length
	}

	get canGoBack() {
		return !!(this.__current.prev)
	}

	get canGoForward() {
		return !!(this.__current.next)
	}

	go(delta) {
		const oldCurrent = this.__current
		let newCurrent = oldCurrent

		const proceed = () => {
			this.__current = newCurrent
			this.__emitPopState()
		}

		if (delta > 0) {
			while (delta) {
				const next = newCurrent.next
				if (next) newCurrent = next
				else break

				delta -= 1
			}

			if (this.__handlers.handleForward) {
				this.__handlers.handleForward(oldCurrent, newCurrent, proceed)
			} else {
				proceed()
			}
		} else {
			while (delta) {
				const prev = newCurrent.prev
				if (prev) newCurrent = prev
				else break

				delta += 1
			}

			if (this.__handlers.handleBack) {
				this.__handlers.handleBack(oldCurrent, newCurrent, proceed)
			} else {
				proceed()
			}
		}
	}

	forward() {
		if (!this.canGoForward) return
		this.go(1)
	}

	back() {
		if (!this.canGoBack) return
		this.go(-1)
	}

	pushState(state, title, url) {
		const oldCurrent = this.__current
		const newCurrent = { state, title, url, prev: null, next: null, idx: 0 }
		if (this.__length) {
			newCurrent.prev = oldCurrent
			newCurrent.idx = oldCurrent.idx + 1
		}

		const proceed = () => {
			oldCurrent.next = newCurrent
			this.__length = newCurrent.idx + 1
			this.__current = newCurrent
			this.__emitPopState()
		}

		if (this.__handlers.handlePushState) {
			this.__handlers.handlePushState(oldCurrent, newCurrent, proceed)
		} else {
			proceed()
		}
	}

	replaceState(state, title, url) {
		const oldCurrent = this.__current
		const { prev, next, idx } = oldCurrent
		const newCurrent = { state, title, url, prev, next, idx }
		if (idx < 0) newCurrent.idx = 0

		const proceed = () => {
			if (idx < 0) this.__length = 1
			this.__current = newCurrent
			this.__emitPopState()
		}

		if (this.__handlers.handleReplaceState) {
			this.__handlers.handleReplaceState(oldCurrent, newCurrent, proceed)
		} else {
			proceed()
		}
	}
}

export default History
