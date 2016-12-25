// Alarm sounds
var intermediaryAlarm = new Audio("assets/alarm-intermediary.mp3");
var finalAlarm = new Audio("assets/alarm-final.mp3");

// Timers object
var timers = {
  min: null,
  max: null,
  ticker: null,
};

function generateRandomInterval(interval) {
  return Math.round(Math.random() * interval);
}

function startMinTimeout(timeout, callback) {
  timers.min = window.setTimeout(function() {
    intermediaryAlarm.play();
    if (callback) callback();
  }, timeout * 1000);
}

function clearMinTimeout() {
  if (timers.min) {
    window.clearTimeout(timers.min);
    timers.min = null;
  }
}

function startMaxTimeout(timeout, callback) {
  timers.max = window.setTimeout(function() {
    finalAlarm.play();
    if (callback) callback();
  }, timeout * 1000);
}

function clearMaxTimeout() {
  if (timers.max) {
    window.clearTimeout(timers.max);
    timers.max = null;
  }
}

function clearTicker() {
  if (timers.ticker) {
    window.clearInterval(timers.ticker);
    timers.ticker = null;
  }
}

function incrementBaseTimer() {
  if (this.timeRemaining > 0) this.timeRemaining -= 1;
  else clearTicker();
}

function leftPad(num) {
  var str = "" + num
  var pad = "00";
  return pad.substring(0, pad.length - str.length) + str
}

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    minTime: 10,
    maxTime: 30,
    timerRunning: false,
    timeRemaining: 10
  },
  computed: {
    minTimeLabel: function getMinTimeLabel() {
      var label = this.minTime + ' minute';
      if (this.minTime !== 1) label += 's';
      return label;
    },
    maxTimeLabel: function getMaxTimeLabel() {
      var label = this.maxTime + ' minute';
      if (this.maxTime !== 1) label += 's';
      return label;
    },
    remainingTimeLabel: function() {
      return leftPad(Math.round(this.timeRemaining / 60)) + ':' + leftPad(this.timeRemaining % 60);
    },
  },
  methods: {
    start: function() {
      var timeout = this.minTime + generateRandomInterval(this.maxTime - this.minTime);

      console.log('starting timer with min', this.minTime, 'and max', timeout);

      // Update Vue state
      this.timerRunning = true;
      this.timeRemaining = this.minTime;
      // Set up timeouts and intervals
      startMinTimeout(this.minTime);
      startMaxTimeout(timeout, this.stop.bind(this));
      timers.ticker = window.setInterval(incrementBaseTimer.bind(this), 1000);
    },
    stop: function() {
      // Clear timeouts and intervals
      clearMinTimeout();
      clearMaxTimeout();
      clearTicker();
      // Update Vue state
      this.timerRunning = false;
      this.timeRemaining = this.minTime;
    },
    incrementMinTime: function() {
      this.minTime += 1;
    },
    decrementMinTime: function() {
      if (this.minTime > 0) this.minTime -= 1;
    },
    incrementMaxTime: function() {
      this.maxTime += 1;
    },
    decrementMaxTime: function() {
      if (this.maxTime > 0) this.maxTime -= 1;
    },
  }
});
