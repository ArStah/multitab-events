import EventEmitter from 'awesome-event-emitter';

const buses = {};

function init() {
  if (Object.values(buses).length === 0)
    window.addEventListener('storage', (e) => {
      Object.values(buses).forEach((bus) => {
        if (e.key === bus.key) {
          if (e.newValue == null)
            return;
          let data = JSON.parse(e.newValue);
          bus.emit(data.event, data.value, true);
        }
      });
    });
}

export default class MultiTabEvents extends EventEmitter {
  static getBus(prefix) {
    if (prefix in buses) {
      return buses[prefix];
    }
    init();
    const bus = buses[prefix] = new this(prefix);
    return bus;
  }

  constructor(prefix) {
    super();
    Object.defineProperties(this, {
      prefix: { value: prefix },
      key: { value: `$mte:${prefix}.event` },
    });
    this.any((eventName, value = null, local = false) => {
      if (local) return;
      const data = {};
      if (value !== null) data.value = value;
      data.event = eventName;
      data.time = +new Date;
      localStorage.setItem(this.key, JSON.stringify(data));
    });
  }
}
