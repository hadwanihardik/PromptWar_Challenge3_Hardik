/**
 * calendar.js
 * Google Calendar deep link generator for CarbonSathi eco habit reminders.
 * Creates "Add to Calendar" URLs that open Google Calendar's event creation page
 * pre-filled with eco reminder details.
 */

import { t } from "./i18n.js";

const CALENDAR_BASE =
  "https://calendar.google.com/calendar/render?action=TEMPLATE";

/**
 * Formats a Date object to Google Calendar's YYYYMMDDTHHmmssZ format.
 * @param {Date} date
 * @returns {string}
 */
const formatCalendarDate = (date) => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, "");
};

/**
 * Generates a Google Calendar event creation URL.
 * @param {Object} options
 * @param {string} options.title - Event title
 * @param {string} options.description - Event description
 * @param {Date} options.startDate - Start date/time
 * @param {Date} [options.endDate] - End date/time (defaults to 1 hour after start)
 * @param {boolean} [options.recurring] - Whether to add weekly recurrence
 * @returns {string} Google Calendar URL
 */
const createCalendarEventUrl = ({
  title,
  description,
  startDate,
  endDate,
  recurring = false,
}) => {
  const start = formatCalendarDate(startDate);
  const end = endDate
    ? formatCalendarDate(endDate)
    : formatCalendarDate(new Date(startDate.getTime() + 60 * 60 * 1000));

  const params = new URLSearchParams({
    text: title,
    details: description,
    dates: `${start}/${end}`,
  });

  if (recurring) {
    params.append("recur", "RRULE:FREQ=WEEKLY;COUNT=12");
  }

  return `${CALENDAR_BASE}&${params.toString()}`;
};

// ─── PRE-BUILT REMINDER GENERATORS ───────────────────────────────────────────

/**
 * Creates a weekly carbon check-in reminder starting next Monday.
 * @returns {string} Calendar URL
 */
const getWeeklyCheckInUrl = () => {
  const nextMonday = new Date();
  const day = nextMonday.getDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0);

  return createCalendarEventUrl({
    title: t("cal_weekly_event_title", "🌱 CarbonSathi Weekly Check-In"),
    description: t(
      "cal_weekly_event_desc",
      "Review your carbon footprint this week. Open CarbonSathi, check your dashboard, and complete one eco challenge. Small actions add up to big impact!",
    ),
    startDate: nextMonday,
    recurring: true,
  });
};

/**
 * Creates a "Meatless Monday" meal reminder for next Monday.
 * @returns {string} Calendar URL
 */
const getMeatlessMondayUrl = () => {
  const nextMonday = new Date();
  const day = nextMonday.getDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
  nextMonday.setHours(12, 0, 0, 0);

  return createCalendarEventUrl({
    title: t("cal_meatless_event_title", "🥗 Meatless Monday — Eco Habit"),
    description: t(
      "cal_meatless_event_desc",
      "Choose a plant-based meal today! Skipping meat once a week can save up to 1.5 kg CO₂. Every meal counts.",
    ),
    startDate: nextMonday,
    recurring: true,
  });
};

/**
 * Creates a morning eco challenge reminder for tomorrow.
 * @param {string} challengeTitle - The challenge to remind about
 * @returns {string} Calendar URL
 */
const getChallengReminderUrl = (challengeTitle = "Eco Challenge") => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const titlePrefix = t(
    "calendar_challenge_prefix",
    "🌿 CarbonSathi Challenge",
  );
  const descPrefix = t(
    "calendar_challenge_desc_prefix",
    "Today's eco challenge",
  );
  const descSuffix = t(
    "calendar_challenge_desc_suffix",
    "Complete it and earn green points! Open CarbonSathi to log your progress.",
  );

  return createCalendarEventUrl({
    title: `${titlePrefix}: ${challengeTitle}`,
    description: `${descPrefix}: ${challengeTitle}. ${descSuffix}`,
    startDate: tomorrow,
    recurring: false,
  });
};

/**
 * Creates an evening unplug reminder (weekly recurring).
 * @returns {string} Calendar URL
 */
const getUnplugReminderUrl = () => {
  const tonight = new Date();
  tonight.setHours(21, 30, 0, 0);
  if (tonight < new Date()) {
    tonight.setDate(tonight.getDate() + 1);
  }

  return createCalendarEventUrl({
    title: t("cal_unplug_event_title", "🔌 Unplug Before Bed — Save Energy"),
    description: t(
      "cal_unplug_event_desc",
      "Switch off and unplug non-essential electronics tonight. Standby power wastes energy and adds to your carbon footprint.",
    ),
    startDate: tonight,
    recurring: true,
  });
};

/**
 * Returns all pre-built reminder options for the UI.
 * @returns {Object[]} Array of { id, label, description, icon, getUrl }
 */
const getAllCalendarReminders = () => [
  {
    id: "cal_weekly",
    label: "Weekly Carbon Check-In",
    description: "Review your footprint every Monday morning.",
    icon: "📊",
    url: getWeeklyCheckInUrl(),
  },
  {
    id: "cal_meatless",
    label: "Meatless Monday Reminder",
    description: "Plant-based meal every Monday — saves 1.5 kg CO₂.",
    icon: "🥗",
    url: getMeatlessMondayUrl(),
  },
  {
    id: "cal_unplug",
    label: "Evening Unplug Reminder",
    description: "Switch off devices every night to cut standby waste.",
    icon: "🔌",
    url: getUnplugReminderUrl(),
  },
  {
    id: "cal_custom",
    label: "Custom Challenge Reminder",
    description: "Set a reminder for any eco challenge you choose.",
    icon: "🌿",
    url: getChallengReminderUrl(
      t("cal_custom_event_challenge", "Complete One Eco Challenge Today"),
    ),
  },
];

export {
  createCalendarEventUrl,
  getWeeklyCheckInUrl,
  getMeatlessMondayUrl,
  getChallengReminderUrl,
  getUnplugReminderUrl,
  getAllCalendarReminders,
};
