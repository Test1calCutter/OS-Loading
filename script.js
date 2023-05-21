// Loading bar

document.addEventListener('DOMContentLoaded', function() {
    
    let states = {
    'INIT_BEFORE_MAP_LOADED': {
      weight: 0.1,
      count: 0,
      done: 0
    },
    'MAP': {
      weight: 0.4,
      count: 0,
      done: 0
    },
    'INIT_AFTER_MAP_LOADED': {
      weight: 0.3,
      count: 0,
      done: 0
    },
    'INIT_SESSION': {
      weight: 0.2,
      count: 0,
      done: 0
    }
  };
  
  const handlers = {
    startInitFunctionOrder: (data) => {
      if (data.type == 'INIT_SESSION' && states['INIT_BEFORE_MAP_LOADED'].count < 1) {
        states['INIT_BEFORE_MAP_LOADED'].count = 1;
        states['INIT_BEFORE_MAP_LOADED'].done = 1;
        states['MAP'].count = 1;
        states['MAP'].done = 1;
        states['INIT_AFTER_MAP_LOADED'].count = 1;
        states['INIT_AFTER_MAP_LOADED'].done = 1;
      }
  
      states[data.type].count += data.count;
    },
    initFunctionInvoked: (data) => states[data.type].done++,
    startDataFileEntries: (data) => states['MAP'].count = data.count,
    performMapLoadFunction: (data) => states['MAP'].done++
  };
  
  let last = 0;
  
  window.addEventListener('message', (e) => (handlers[e.data.eventName] || (() => {}))(e.data));
  
  setInterval(() => {
    let progress = 0;
    for (let type in states) {
      const state = states[type];
      if (state.done < 1 || state.count < 1) continue;
      progress += (state.done / state.count) * state.weight;
    }
  
    let total = Math.min(Math.round(progress * 100), 100);
    if (total < last) total = last;
    last = total;
  
    document.getElementById('progress').value = total;
  }, 100);});