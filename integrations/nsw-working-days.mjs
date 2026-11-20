// NSW Government statewide calendar and Glenorie local declarations, checked 21 Nov 2026.
// https://www.nsw.gov.au/about-nsw/public-holidays
// https://www.nsw.gov.au/about-nsw/public-holidays/local-public-holidays
// The extra Anzac Mondays were proclaimed for these two years only. When NSW
// publishes a new calendar, add any special days applicable at Glenorie here.
const exceptionalDays = new Set(['2026-04-27','2027-04-26']);
const dayMs = 86400000;

// Gregorian Easter, Meeus/Jones/Butcher computus. All divisions below are integer divisions.
function easter(year) {
  const div = (n,d) => Math.floor(n / d);
  const lunarCycle = year % 19;
  const century = div(year,100);
  const yearInCentury = year % 100;
  const lunarCorrection = div(century - div(century+8,25) + 1,3);
  const fullMoon = (19*lunarCycle + century - div(century,4) - lunarCorrection + 15) % 30;
  const weekdayCorrection = (32 + 2*(century%4) + 2*div(yearInCentury,4) - fullMoon - yearInCentury%4) % 7;
  const adjustment = div(lunarCycle + 11*fullMoon + 22*weekdayCorrection,451);
  const position = fullMoon + weekdayCorrection - 7*adjustment + 114;
  return Date.UTC(year,div(position,31)-1,position%31+1);
}

// Weekday closures under the current NSW Public Holidays Act 2010, section 4.
// A weekend Anzac Day has no automatic Monday substitute under the standard.
// The August bank holiday is not a general farm holiday.
function statutoryHolidays(year) {
  const days = new Set();
  function dateKey(ms) { return new Date(ms).toISOString().slice(0,10); }
  function add(month,day) { days.add(dateKey(Date.UTC(year,month-1,day))); }
  function observed(month,day) {
    let instant = Date.UTC(year,month-1,day);
    while ([0,6].includes(new Date(instant).getUTCDay()) || days.has(dateKey(instant))) instant+=dayMs;
    days.add(dateKey(instant));
  }
  function monday(month,ordinal) {
    const first = new Date(Date.UTC(year,month-1,1)).getUTCDay();
    add(month,1+(8-first)%7+7*(ordinal-1));
  }
  observed(1,1);
  observed(1,26);
  add(4,25);
  monday(6,2);
  monday(10,1);
  // Protect both actual festival dates before looking for collision-free substitutes.
  add(12,25);
  add(12,26);
  for (const day of [25,26]) {
    if ([0,6].includes(new Date(Date.UTC(year,11,day)).getUTCDay())) observed(12,day);
  }
  const easterSunday = easter(year);
  days.add(dateKey(easterSunday-2*dayMs));
  days.add(dateKey(easterSunday+dayMs));
  return days;
}

const localClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
});

// Represent the Sydney wall clock on a UTC timeline for ordinary Gregorian date arithmetic.
function wallClock(date) {
  const parts = Object.fromEntries(localClock.formatToParts(date).map(part => [part.type,part.value]));
  return new Date(Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute,+parts.second,date.getUTCMilliseconds()));
}

// The day of the request is excluded. The release occurs at the same local clock time
// on the fifth subsequent working day, including when the UTC offset changes during the hold.
export function withdrawalReleaseAt(requestedAt) {
  if (typeof requestedAt === 'string' && !/(?:Z|[+-]\d{2}:\d{2})$/i.test(requestedAt)) {
    throw new RangeError('Withdrawal time needs an explicit time zone');
  }
  if (requestedAt == null) throw new RangeError('Withdrawal time is required');
  const date = new Date(requestedAt);
  if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid withdrawal time');
  const wall = wallClock(date);
  let calendarYear;
  let holidays;
  let remaining = 5;
  while (remaining > 0) {
    wall.setUTCDate(wall.getUTCDate()+1);
    if (calendarYear !== wall.getUTCFullYear()) {
      calendarYear = wall.getUTCFullYear();
      holidays = statutoryHolidays(calendarYear);
    }
    const day = wall.toISOString().slice(0,10);
    const weekday = wall.getUTCDay();
    if (weekday > 0 && weekday < 6 && !holidays.has(day) && !exceptionalDays.has(day)) remaining--;
  }
  // A release day is a weekday; Sydney's clock changes on Sundays.
  const offset = wallClock(wall).getTime() - wall.getTime();
  return new Date(wall.getTime() - offset).toISOString();
}
