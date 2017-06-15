function getValue(el) {
  return document.querySelector(el).value;
}

function setValue(el, val) {
  document.querySelector(el).value = val;
  return val;
}
/**
 * Po
 * @param {Object} options
 */
function Po(options) {
  this.axiom = options.axiom;
  this.rules = options.rules;
  this.iteration = options.iteration;
  this.duration = options.duration;

  this.constant = [['{', '{'], ['}', '}']];

  this.LString = '';

  setValue('#rules', this.rules.map(r => `${r[0]} = ${r[1]}`).join(',\n'));

  setValue('#iteration', this.iteration);
  setValue('#axiom', this.axiom);
  setValue('#duration', this.duration);
}

Po.prototype.getValuesFromDocument = function() {
  this.iteration = getValue('#iteration');
  this.axiom = getValue('#axiom');
  this.duration = getValue('#duration');

  this.rules = getValue('#rules')
    .split(',')
    .map(r => r.replace(/\s/g, '').split('='));
};

Po.prototype.init = function() {
  this.getValuesFromDocument();
  this.generateLString(this.axiom);
};

Po.prototype.generateLString = function(str) {
  this.LString = str;
  let tmp = '';
  const _rules = this.rules.concat(this.constant);
  Array.from(str).map(c => {
    _rules.map(rule => {
      if (rule[0] == c) {
        tmp += c.replace(rule[0], rule[1]);
      }
    });
  });

  if (this.iteration) {
    this.iteration--;
    this.generateLString(tmp);
  }
};

let interval = null;

Po.prototype.play = function() {
  console.log('Result : ', this.LString);

  let duration = this.duration;
  const fractal = this.LString;
  let fractalSize = this.LString.length;

  interval = setInterval(() => {
    fractalSize--;
    duration -= 10;
    console.log(duration);

    if (fractalSize !== 0) {
      playSound(fractal[fractalSize - 1]);
    }
  }, duration);

  function playSound(note) {
    const audio = document.querySelector(`audio[data-key="${note}"]`);
    const key = document.querySelector(`div[data-key="${note}"]`);
    if (!audio) return;

    key.classList.add('playing');
    audio.currentTime = 0;
    setTimeout(() => {
      key.classList.remove('playing');
    }, duration);
    audio.play();
  }
};

Po.prototype.stop = function() {
  clearInterval(interval);
};

Po.prototype.start = function() {
  this.stop();
  this.init();
  this.play();
};

window.Po = Po;
