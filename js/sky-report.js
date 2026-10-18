const LAT = 43.0723037, LON = 88.0315758, TZ = 'America/Chicago';
const reportElement = document.getElementById('sky-report');

async function loadSkyReport() {
  const url = 'https://www.cyclecalcs.com/v2/today'
    + '?lat=' + LAT + '&lon=' + LON + '&tz=' + encodeURIComponent(TZ);
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'API answered ' + res.status);
  }

  const { data } = body;
  const lines = ['Sky report for ' + data.local_date];
  lines.push('Moon: ' + data.moon.phase.name + ', '
    + data.moon.phase.illumination_percent + '% lit.');

  const up = data.planets_up.filter(p => p.naked_eye);
  lines.push(up.length
    ? 'Naked-eye planets above the horizon: '
      + up.map(p => p.name + ' (' + p.visibility.toLowerCase() + ')').join(', ') + '.'
    : 'No naked-eye planet is above the horizon right now.');

  lines.push('Darkness: ' + data.night.verdict);

  const next = data.next_events[0];
  if (next) lines.push('Coming up: ' + next.label + ', '
    + Math.round(next.days_until) + ' days away.');

  reportElement.textContent = lines.join('\n');
}

loadSkyReport().catch(error => {
  console.error('Unable to load the sky report:', error);
  reportElement.textContent = 'Sky report unavailable: ' + error.message;
});
