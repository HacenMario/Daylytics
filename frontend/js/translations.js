/**
 * Translations - Multi-language support
 * الترجمة - دعم متعدد اللغات
 */

class Translations {
    constructor() {
        this.translations = {
            ar: {
                // Auth
                'login': 'تسجيل الدخول',
                'signup': 'إنشاء حساب',
                'logout': 'تسجيل الخروج',
                'email': 'البريد الإلكتروني',
                'password': 'كلمة المرور',
                'name': 'الاسم',
                'login_btn': 'دخول',
                'signup_btn': 'تسجيل',
                'no_account': 'ليس لديك حساب؟',
                'have_account': 'لديك حساب؟',
                'push_enable': 'تفعيل الإشعارات',
                
                // Dashboard
                'productivity': 'الإنتاجية',
                'rest': 'الراحة',
                'sleep': 'النوم',
                'stress': 'الإجهاد',
                'activities': 'الأنشطة',
                'today': 'اليوم',
                'yesterday': 'الأمس',
                'this_week': 'هذا الأسبوع',
                'last_week': 'الأسبوع الماضي',
                'this_month': 'هذا الشهر',
                'last_month': 'الشهر الماضي',
                
                // Activities
                'add_activity': 'إضافة نشاط',
                'activity_name': 'اسم النشاط',
                'duration': 'المدة (دقائق)',
                'start_time': 'وقت البدء',
                'category': 'الفئة',
                'quality': 'الجودة (1-10)',
                'notes': 'ملاحظات',
                'work': 'عمل',
                'exercise': 'رياضة',
                'leisure': 'ترفيه',
                'selfcare': 'عناية ذاتية',
                'social': 'تواصل اجتماعي',
                'education': 'تعليم',
                'other': 'أخرى',
                
                // Insights
                'insights': 'التحليلات الذكية',
                'recommendations': 'التوصيات',
                'comparison': 'المقارنة',
                'trend_up': 'تحسن',
                'trend_down': 'انخفاض',
                
                // Messages
                'login_success': 'تم تسجيل الدخول بنجاح! 🎉',
                'signup_success': 'تم إنشاء الحساب بنجاح! 🎉',
                'login_error': 'فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.',
                'signup_error': 'فشل إنشاء الحساب. حاول مرة أخرى.',
                'activity_added': 'تم إضافة النشاط بنجاح!',
                'activity_deleted': 'تم حذف النشاط',
                'push_enabled': 'تم تفعيل الإشعارات!',
                'no_activities': 'لا توجد أنشطة مسجلة اليوم',
                'please_fill_fields': 'يرجى ملء جميع الحقول المطلوبة',
                'logout_success': 'تم تسجيل الخروج بنجاح',
                'confirm_delete': 'هل أنت متأكد من حذف هذا النشاط؟'
            },
            
            fr: {
                // Auth
                'login': 'Connexion',
                'signup': "S'inscrire",
                'logout': 'Déconnexion',
                'email': 'Email',
                'password': 'Mot de passe',
                'name': 'Nom',
                'login_btn': 'Se connecter',
                'signup_btn': "Créer un compte",
                'no_account': 'Pas de compte ?',
                'have_account': 'Déjà un compte ?',
                'push_enable': 'Activer les notifications',
                
                // Dashboard
                'productivity': 'Productivité',
                'rest': 'Repos',
                'sleep': 'Sommeil',
                'stress': 'Stress',
                'activities': 'Activités',
                'today': "Aujourd'hui",
                'yesterday': 'Hier',
                'this_week': 'Cette semaine',
                'last_week': 'Semaine dernière',
                'this_month': 'Ce mois',
                'last_month': 'Mois dernier',
                
                // Activities
                'add_activity': "Ajouter une activité",
                'activity_name': "Nom de l'activité",
                'duration': 'Durée (min)',
                'start_time': 'Heure de début',
                'category': 'Catégorie',
                'quality': 'Qualité (1-10)',
                'notes': 'Notes',
                'work': 'Travail',
                'exercise': 'Sport',
                'leisure': 'Loisir',
                'selfcare': 'Bien-être',
                'social': 'Social',
                'education': 'Éducation',
                'other': 'Autre',
                
                // Insights
                'insights': 'Analyses intelligentes',
                'recommendations': 'Recommandations',
                'comparison': 'Comparaison',
                'trend_up': 'Amélioration',
                'trend_down': 'Baisse',
                
                // Messages
                'login_success': 'Connexion réussie ! 🎉',
                'signup_success': 'Compte créé avec succès ! 🎉',
                'login_error': 'Échec de la connexion. Vérifiez vos identifiants.',
                'signup_error': "Échec de la création du compte.",
                'activity_added': 'Activité ajoutée avec succès !',
                'activity_deleted': 'Activité supprimée',
                'push_enabled': 'Notifications activées !',
                'no_activities': "Aucune activité enregistrée aujourd'hui",
                'please_fill_fields': 'Veuillez remplir tous les champs',
                'logout_success': 'Déconnexion réussie',
                'confirm_delete': 'Êtes-vous sûr de vouloir supprimer cette activité ?'
            },
            
            en: {
                // Auth
                'login': 'Login',
                'signup': 'Sign Up',
                'logout': 'Logout',
                'email': 'Email',
                'password': 'Password',
                'name': 'Name',
                'login_btn': 'Login',
                'signup_btn': 'Create Account',
                'no_account': "Don't have an account?",
                'have_account': 'Already have an account?',
                'push_enable': 'Enable Notifications',
                
                // Dashboard
                'productivity': 'Productivity',
                'rest': 'Rest',
                'sleep': 'Sleep',
                'stress': 'Stress',
                'activities': 'Activities',
                'today': 'Today',
                'yesterday': 'Yesterday',
                'this_week': 'This Week',
                'last_week': 'Last Week',
                'this_month': 'This Month',
                'last_month': 'Last Month',
                
                // Activities
                'add_activity': 'Add Activity',
                'activity_name': 'Activity Name',
                'duration': 'Duration (min)',
                'start_time': 'Start Time',
                'category': 'Category',
                'quality': 'Quality (1-10)',
                'notes': 'Notes',
                'work': 'Work',
                'exercise': 'Exercise',
                'leisure': 'Leisure',
                'selfcare': 'Self Care',
                'social': 'Social',
                'education': 'Education',
                'other': 'Other',
                
                // Insights
                'insights': 'Smart Analytics',
                'recommendations': 'Recommendations',
                'comparison': 'Comparison',
                'trend_up': 'Improvement',
                'trend_down': 'Decline',
                
                // Messages
                'login_success': 'Login successful! 🎉',
                'signup_success': 'Account created successfully! 🎉',
                'login_error': 'Login failed. Check your credentials.',
                'signup_error': 'Failed to create account.',
                'activity_added': 'Activity added successfully!',
                'activity_deleted': 'Activity deleted',
                'push_enabled': 'Push notifications enabled!',
                'no_activities': 'No activities logged today',
                'please_fill_fields': 'Please fill all required fields',
                'logout_success': 'Logged out successfully',
                'confirm_delete': 'Are you sure you want to delete this activity?'
            }
        };
    }
    
    get(key, lang = 'ar') {
        return this.translations[lang]?.[key] || this.translations['ar'][key] || key;
    }
}

// Make it globally available
window.Translations = Translations;