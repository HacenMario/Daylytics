/**
 * Validators - Input validation utilities
 * التحقق من صحة المدخلات
 */

/**
 * Validate email format
 * التحقق من صيغة البريد الإلكتروني
 */
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

/**
 * Validate password strength (minimum 6 characters)
 * التحقق من قوة كلمة المرور (6 أحرف على الأقل)
 */
const validatePassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Validate duration (must be between 1 and 1440 minutes)
 * التحقق من المدة (بين 1 و 1440 دقيقة)
 */
const validateDuration = (duration) => {
    const num = parseInt(duration);
    return !isNaN(num) && num > 0 && num <= 1440; // max 24 hours
};

/**
 * Validate activity name (non-empty)
 * التحقق من اسم النشاط (غير فارغ)
 */
const validateActivityName = (name) => {
    return name && name.trim().length > 0;
};

/**
 * Validate quality rating (1-10)
 * التحقق من تقييم الجودة (1-10)
 */
const validateQuality = (quality) => {
    const num = parseInt(quality);
    return !isNaN(num) && num >= 1 && num <= 10;
};

/**
 * Validate time format (HH:mm)
 * التحقق من صيغة الوقت (HH:mm)
 */
const validateTime = (time) => {
    const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(time);
};

/**
 * Validate category
 * التحقق من الفئة
 */
const validateCategory = (category) => {
    const categories = ['work', 'exercise', 'leisure', 'selfcare', 'social', 'education', 'other'];
    return categories.includes(category);
};

module.exports = {
    validateEmail,
    validatePassword,
    validateDuration,
    validateActivityName,
    validateQuality,
    validateTime,
    validateCategory
};