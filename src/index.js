import { EventEmitter2 as EventEmitter } from 'eventemitter2';

const buses = {};

function init() {
  if (Object.values(buses).length === 0) {
    window.addEventListener('storage', (e) => {
      if (e.newValue === null) {
        return;
      }
      const data = JSON.parse(e.newValue);
      Object
        .values(buses)
        .find(bus => e.key === bus.key)
        .emit(data.event, data.value, true);
    });
  }
}

export default class MultiTabEvents extends EventEmitter {
  static getBus(prefix) {
    if (Object.prototype.hasOwnProperty.call(buses, prefix)) {
      return buses[prefix];
    }
    init();
    const bus = new this(prefix);
    buses[prefix] = bus;
    return bus;
  }

  constructor(prefix) {
    super();
    Object.defineProperties(this, {
      prefix: { value: prefix },
      key: { value: `$mte:${prefix}.event` },
    });

    this.onAny((eventName, value = null, local = false) => {
      if (local) return;
      const data = {};
      if (value !== null) {
        data.value = value;
      }
      data.event = eventName;
      data.time = +new Date();
      localStorage.setItem(this.key, JSON.stringify(data));
    });
  }
}
