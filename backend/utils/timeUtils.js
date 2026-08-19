/**
 * Time Utilities
 * أدوات الوقت
 */

/**
 * Get start of day (midnight)
 * الحصول على بداية اليوم (منتصف الليل)
 */
const getStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get end of day (23:59:59.999)
 * الحصول على نهاية اليوم
 */
const getEndOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

/**
 * Get start of week (Sunday)
 * الحصول على بداية الأسبوع (الأحد)
 */
const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get end of week (Saturday)
 * الحصول على نهاية الأسبوع (السبت)
 */
const getEndOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    d.setHours(23, 59, 59, 999);
    return d;
};

/**
 * Get start of month
 * الحصول على بداية الشهر
 */
const getStartOfMonth = (date = new Date()) => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get end of month
 * الحصول على نهاية الشهر
 */
const getEndOfMonth = (date = new Date()) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    d.setHours(23, 59, 59, 999);
    return d;
};

/**
 * Format minutes to readable time (e.g., "2h 30min")
 * تحويل الدقائق إلى وقت قابل للقراءة
 */
const formatTime = (minutes) => {
    const mins = parseInt(minutes);
    if (isNaN(mins) || mins < 0) return '0min';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0 && remainingMins > 0) {
        return `${hours}h ${remainingMins}min`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${remainingMins}min`;
    }
};

/**
 * Parse time string to minutes
 * تحويل الوقت إلى دقائق
 */
const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return 0;
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return (hours * 60) + minutes;
};

/**
 * Check if time is between two times
 * التحقق من أن الوقت بين وقتين
 */
const isTimeBetween = (time, startTime, endTime) => {
    const t = parseTimeToMinutes(time);
    const s = parseTimeToMinutes(startTime);
    const e = parseTimeToMinutes(endTime);
    return t >= s && t <= e;
};

/**
 * Get current time in HH:mm format
 * الحصول على الوقت الحالي بصيغة HH:mm
 */
const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * Get current date in YYYY-MM-DD format
 * الحصول على التاريخ الحالي بصيغة YYYY-MM-DD
 */
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Calculate time difference in minutes
 * حساب فرق الوقت بالدقائق
 */
const getTimeDifference = (startTime, endTime) => {
    const s = parseTimeToMinutes(startTime);
    const e = parseTimeToMinutes(endTime);
    return e - s;
};

module.exports = {
    getStartOfDay,
    getEndOfDay,
    getStartOfWeek,
    getEndOfWeek,
    getStartOfMonth,
    getEndOfMonth,
    formatTime,
    parseTimeToMinutes,
    isTimeBetween,
    getCurrentTime,
    getCurrentDate,
    getTimeDifference
};