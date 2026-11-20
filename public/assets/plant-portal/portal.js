'use strict';

(() => {
  const main = document.getElementById('main');
  const explorer = document.getElementById('row-app');
  if (!main || !explorer) return;

  const world = explorer.querySelector('.world');
  const rail = explorer.querySelector('.rail');
  const list = document.getElementById('position-list');
  const request = document.getElementById('request');
  const rowButtons = [...explorer.querySelectorAll('[data-row]')];
  const arrows = [...explorer.querySelectorAll('[data-move]')];
  const count = 19;
  const inventory = new Map();
  let row = 1;
  let position = 1;
  let connection = 'checking';

  const key = (r, p) => 'r' + r + '-p' + p;
  const digits = n => String(n).padStart(2, '0');

  // Map markers and the keyboard-friendly number rail are equivalent views.
  for (let r = 1; r <= 2; r++) {
    for (let p = count; p >= 1; p--) {
      const marker = document.createElement('button');
      const scale = 1 / (1 + 4 * (p - 1) / (count - 1));
      const x = r === 1 ? 33.5 - 11.5 * scale : 71 + 5 * scale;
      marker.type = 'button';
      marker.tabIndex = -1;
      marker.dataset.marker = digits(p);
      marker.dataset.key = key(r, p);
      marker.style.left = x + '%';
      marker.style.top = (27 + 60 * scale) + '%';
      marker.style.setProperty('--plant-size', (12 + 72 * scale) + 'px');
      marker.style.setProperty('--depth', count - p);
      marker.addEventListener('click', () => choose(r, p));
      world.append(marker);
    }
  }

  const numberButtons = [];
  for (let p = 1; p <= count; p++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = digits(p);
    button.addEventListener('click', () => choose(row, p));
    button.addEventListener('keydown', event => {
      const next = { ArrowLeft: p - 1, ArrowRight: p + 1, Home: 1, End: count }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      const valid = Math.max(1, Math.min(count, next));
      choose(row, valid);
      numberButtons[valid - 1].focus({ preventScroll: true });
    });
    rail.append(button);
    numberButtons.push(button);
  }

  function updateStatus() {
    const status = inventory.get(key(row, position));
    const unavailable = status === 'unavailable';
    let message = 'This position has yet to be verified in the field.';
    if (connection === 'checking') message = 'Checking with the farm…';
    if (connection === 'offline') message = 'Availability could not be loaded. The farmer will confirm your preference.';
    if (status === 'available') message = 'Field-verified and open for a school request.';
    if (unavailable) message = 'This position is unavailable. Explore another plant or apply without a preference.';
    document.getElementById('availability').textContent = message;
    request.hidden = unavailable;
    if (!unavailable) {
      request.href = main.dataset.teacher + '?prefer=' + key(row, position);
      request.firstChild.textContent = status === 'available' ? 'Request this plant ' : 'Request this position ';
    }
  }

  function choose(r, p, announce = true) {
    row = r;
    position = p;
    const selectedKey = key(row, position);
    world.classList.toggle('row-two', row === 2);
    world.querySelectorAll('[data-key]').forEach(marker => {
      const activeRow = marker.dataset.key.startsWith('r' + row + '-');
      marker.classList.toggle('selected', marker.dataset.key === selectedKey);
      marker.disabled = !activeRow;
    });
    rowButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.row) === row)));
    arrows.forEach(button => button.setAttribute('aria-disabled', String(row + Number(button.dataset.move) < 1 || row + Number(button.dataset.move) > 2)));
    numberButtons.forEach((button, i) => {
      const selected = i + 1 === position;
      button.tabIndex = selected ? 0 : -1;
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', 'Row ' + row + ', plant ' + (i + 1));
    });
    const active = numberButtons[position - 1];
    const left = active.offsetLeft - rail.offsetLeft;
    if (left < rail.scrollLeft || left + active.offsetWidth > rail.scrollLeft + rail.clientWidth) {
      rail.scrollLeft = left - (rail.clientWidth - active.offsetWidth) / 2;
    }
    list.value = String(position);
    document.getElementById('scene-row').textContent = String(row);
    document.getElementById('pick-row').textContent = 'Row ' + row;
    document.getElementById('pick-title').textContent = 'Plant ' + digits(position);
    document.getElementById('rail-label').textContent = 'Positions in row ' + row;
    updateStatus();
    if (announce) {
      document.getElementById('selection-live').textContent =
        'Row ' + row + ', plant ' + position + '. ' + document.getElementById('availability').textContent;
    }
  }

  rowButtons.forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.row), position)));
  arrows.forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-disabled') !== 'true') choose(row + Number(button.dataset.move), position);
  }));
  list.addEventListener('change', () => choose(row, Number(list.value)));
  main.querySelectorAll('[data-preview]').forEach(link => link.addEventListener('click', () => choose(1, Number(link.dataset.preview))));

  // Use only horizontal gestures inside the artwork. The number rail and page retain native scrolling.
  let start;
  let suppressTap = false;
  const plot = document.getElementById('plot');
  plot.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.target.closest('.scene-arrows')) return;
    suppressTap = false;
    start = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  plot.addEventListener('pointercancel', () => { start = null; });
  plot.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
    suppressTap = true;
    const next = dx < 0 ? 2 : 1;
    if (next !== row) choose(next, position);
  });
  plot.addEventListener('click', event => {
    if (!suppressTap || !event.detail) return;
    suppressTap = false;
    event.stopImmediatePropagation();
    event.preventDefault();
  }, true);

  explorer.hidden = false;
  choose(row, position, false);
  async function readMap() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(main.dataset.mapUrl, {
        credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal
      });
      if (!response.ok) throw new Error('Map unavailable');
      const data = await response.json();
      if (!Array.isArray(data.plants)) throw new Error('Invalid map');
      for (const plant of data.plants) {
        if (plant && [1, 2].includes(plant.row) && Number.isInteger(plant.position)
          && plant.position >= 1 && plant.position <= count && plant.key === key(plant.row, plant.position)
          && ['unverified', 'available', 'unavailable'].includes(plant.status)) {
          inventory.set(plant.key, plant.status);
        }
      }
      connection = 'ready';
    } catch {
      connection = 'offline';
    } finally {
      clearTimeout(timeout);
      updateStatus();
    }
  }
  readMap();
})();
