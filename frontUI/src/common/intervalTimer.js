export default class repeatTime {
	constructor() {
		this.ids = {};

		this.isSeconds = /(seconds?|secs?|^([0-9]+)s)/i;
		this.isMinutes = /(minutes?|mins?|^([0-9]+)m)/i;
		this.isHours = /(hours?|hrs?|^([0-9]+)h)/i;
		this.toString = Object.prototype.toString;
	}
	isNumber(value) {
		return this.toString.call(value) === '[object Number]';
	}
	isString(value) {
		return this.toString.call(value) === '[object String]';
	}
	isBoolean(value) {
		return this.toString.call(value) === '[object Boolean]';
	}
	isArray(value) {
		return this.toString.call(value) === '[object Array]';
	}
	isTime(value) {
		const timeTest = /(seconds?|secs?|^([0-9]+)s|minutes?|mins?|^([0-9]+)m|hours?|hrs?|^([0-9]+)h)/i;
		return this.isNumber(value) || timeTest.test(value);
	}
	parseTime(val) {
		const value = val.split(' ');

		var number = 0,
			unit = '';

		if (value.length > 1) {
			number = parseFloat(value[0]);
			unit = value[1];
		} else {
			number = parseFloat(value);

			if (this.isSeconds.test(value)) {
				unit = 'seconds';
			} else if (this.isMinutes.test(value)) {
				unit = 'minutes';
			} else if (this.isHours.test(value)) {
				unit = 'hours';
			}
		}

		if (this.isSeconds.test(unit)) {
			return number * 1000;
		} else if (this.isMinutes.test(unit)) {
			return number * 60000;
		} else if (this.isHours.test(unit)) {
			return number * 3600000;
		} else {
			return number;
		}
	}
	repeat(time, callback, id, callBefore) {
		let interval = 0;

		time = this.isNumber(time) ? time : this.parseTime(time);

		if (arguments.length === 3) {
			if (this.isBoolean(id)) {
				callBefore = id;
			}
		}

		if (callBefore) callback();
		interval = setInterval(callback, time);

		if (id && this.isString(id)) this.ids[id] = interval;

		return interval;
	}
	wait(time, callback, id) {
		let timeout = 0;

		time = this.isNumber(time) ? time : this.parseTime(time);
		timeout = setTimeout(callback, time);

		if (id && this.isString(id)) this.ids[id] = timeout;

		return timeout;
	}
	_clear(id) {
		clearInterval(id);
		clearTimeout(id);
	}
	clear(id) {
		let _ids = [],
			_id = '';

		if (arguments.length === 0) {
			for (id in this.ids) {
				this._clear(this.ids[id]);
				delete this.ids[id];
			}
		} else if (this.isArray(id) || this.isString(id)) {
			_ids = this.isArray(id) ? id.slice() : [id];
			for (let x = 0; x < _ids.length; x++) {
				_id = _ids[x];

				if (this.isString(_id)) {
					this._clear(this.ids[_id]);
					delete this.ids[_id];
				} else {
					this._clear(_id);
				}
			}
		} else {
			this._clear(id);
		}
	}
}
