import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const dictionaries = {
    en: {
        common: {
            brand: "Easy Facturation",
            tagline: "Smart billing dashboard",
            language: "Language",
            status: {
                success: "Success",
                error: "Error",
                info: "Information",
            },
        },
        auth: {
            welcome: "Welcome back",
            loginTitle: "Sign in to your account",
            loginSubtitle: "Sign in to access your dashboard.",
            registerTitle: "Create your account",
            registerSubtitle: "Join Easy Facturation to streamline your operations.",
            username: "Username",
            password: "Password",
            remember: "Remember me",
            forgot: "Forgot password?",
            submitLogin: "Sign in",
            noAccount: "Don't have an account?",
            registerNow: "Create an account",
            alreadyHave: "Already have an account?",
            submitRegister: "Sign up",
            fullName: "Full name",
            email: "Email",
            confirmPassword: "Confirm password",
            agreeTerms: "I agree to the terms and conditions",
        },
        navbar: {
            home: "Dashboard",
            profile: "Profile",
            settings: "Settings",
            logout: "Sign out",
        },
        dashboard: {
            title: "Performance overview",
            filters: {
                period: "Filter by period",
                enterprise: "Filter by enterprise",
                all: "All",
            },
            cards: {
                sumPayed: "Paid invoices (DZD)",
                countPayed: "Paid invoices",
                sumNotPayed: "Unpaid invoices (DZD)",
                countNotPayed: "Unpaid invoices",
                nbrClient: "Clients",
                nbrOrder: "Purchase orders",
                nbrWorkPeriodic: "Work periods",
                nbrMission: "Missions",
            },
        },
        sidebar: {
            home: "Dashboard",
            clients: "Clients",
            workPeriodic: "Periodic work",
            missions: "Missions",
            services: "Services",
            orders: "Purchase orders",
            factures: "Invoices",
            settings: "Settings",
            general: "General settings",
            users: "User management",
            roles: "Role management",
            quickLogout: "Log out",
        },
        alerts: {
            loginSuccess: "Login successful!",
            loginError: "Login failed. Please try again.",
            invalidCreds: "Invalid credentials",
            serverDown: "Server is not reachable. Please check if it is running.",
            registerSuccess: "Registration successful!",
            registerError: "Registration failed. Please try again.",
            termsRequired: "You must agree to the terms before registering.",
            passwordMismatch: "Passwords do not match!",
        },
    },
    fr: {
        common: {
            brand: "Easy Facturation",
            tagline: "Tableau de bord intelligent",
            language: "Langue",
            status: {
                success: "Succès",
                error: "Erreur",
                info: "Information",
            },
        },
        auth: {
            welcome: "Bon retour",
            loginTitle: "Connectez-vous à votre compte",
            loginSubtitle: "Accédez à votre tableau de bord.",
            registerTitle: "Créez votre compte",
            registerSubtitle: "Rejoignez Easy Facturation pour optimiser vos opérations.",
            username: "Nom d'utilisateur",
            password: "Mot de passe",
            remember: "Se souvenir de moi",
            forgot: "Mot de passe oublié ?",
            submitLogin: "Se connecter",
            noAccount: "Pas encore de compte ?",
            registerNow: "Créer un compte",
            alreadyHave: "Vous avez déjà un compte ?",
            submitRegister: "S'inscrire",
            fullName: "Nom complet",
            email: "Email",
            confirmPassword: "Confirmez le mot de passe",
            agreeTerms: "J'accepte les conditions générales",
        },
        navbar: {
            home: "Tableau de bord",
            profile: "Profil",
            settings: "Paramètres",
            logout: "Se déconnecter",
        },
        dashboard: {
            title: "Vue d'ensemble des performances",
            filters: {
                period: "Filtrer par période",
                enterprise: "Filtrer par entreprise",
                all: "Toutes",
            },
            cards: {
                sumPayed: "Factures payées (DZD)",
                countPayed: "Factures payées",
                sumNotPayed: "Factures impayées (DZD)",
                countNotPayed: "Factures impayées",
                nbrClient: "Clients",
                nbrOrder: "Bons de commande",
                nbrWorkPeriodic: "Travaux périodiques",
                nbrMission: "Missions",
            },
        },
        sidebar: {
            home: "Tableau de bord",
            clients: "Clients",
            workPeriodic: "Travaux périodiques",
            missions: "Missions",
            services: "Services",
            orders: "Bons de commande",
            factures: "Factures",
            settings: "Paramètres",
            general: "Paramètres généraux",
            users: "Gestion des utilisateurs",
            roles: "Gestion des rôles",
            quickLogout: "Déconnexion",
        },
        alerts: {
            loginSuccess: "Connexion réussie !",
            loginError: "La connexion a échoué. Veuillez réessayer.",
            invalidCreds: "Identifiants invalides",
            serverDown: "Serveur inaccessible. Vérifiez s'il est en cours d'exécution.",
            registerSuccess: "Inscription réussie !",
            registerError: "L'inscription a échoué. Veuillez réessayer.",
            termsRequired: "Vous devez accepter les conditions avant de vous inscrire.",
            passwordMismatch: "Les mots de passe ne correspondent pas !",
        },
    },
    ar: {
        common: {
            brand: "إيزي فاكتيورايشن",
            tagline: "منصة فواتير ذكية",
            language: "اللغة",
            status: {
                success: "نجاح",
                error: "خطأ",
                info: "معلومة",
            },
        },
        auth: {
            welcome: "مرحباً بعودتك",
            loginTitle: "سجّل الدخول إلى حسابك",
            loginSubtitle: "ادخل للوصول إلى لوحة التحكم الخاصة بك.",
            registerTitle: "أنشئ حسابك",
            registerSubtitle: "انضم إلى إيزي فاكتيورايشن لتنظيم أعمالك.",
            username: "اسم المستخدم",
            password: "كلمة المرور",
            remember: "تذكرني",
            forgot: "نسيت كلمة المرور؟",
            submitLogin: "تسجيل الدخول",
            noAccount: "ليس لديك حساب؟",
            registerNow: "أنشئ حساباً",
            alreadyHave: "هل لديك حساب بالفعل؟",
            submitRegister: "تسجيل",
            fullName: "الاسم الكامل",
            email: "البريد الإلكتروني",
            confirmPassword: "تأكيد كلمة المرور",
            agreeTerms: "أوافق على الشروط والأحكام",
        },
        navbar: {
            home: "لوحة التحكم",
            profile: "الملف الشخصي",
            settings: "الإعدادات",
            logout: "تسجيل الخروج",
        },
        dashboard: {
            title: "نظرة عامة على الأداء",
            filters: {
                period: "تصفية حسب الفترة",
                enterprise: "تصفية حسب المؤسسة",
                all: "الكل",
            },
            cards: {
                sumPayed: "الفواتير المدفوعة (دج)",
                countPayed: "عدد الفواتير المدفوعة",
                sumNotPayed: "الفواتير غير المدفوعة (دج)",
                countNotPayed: "عدد الفواتير غير المدفوعة",
                nbrClient: "العملاء",
                nbrOrder: "أوامر الشراء",
                nbrWorkPeriodic: "الأعمال الدورية",
                nbrMission: "المهام",
            },
        },
        sidebar: {
            home: "لوحة التحكم",
            clients: "العملاء",
            workPeriodic: "الأعمال الدورية",
            missions: "المهام",
            services: "الخدمات",
            orders: "أوامر الشراء",
            factures: "الفواتير",
            settings: "الإعدادات",
            general: "إعدادات عامة",
            users: "إدارة المستخدمين",
            roles: "إدارة الأدوار",
            quickLogout: "تسجيل الخروج",
        },
        alerts: {
            loginSuccess: "تم تسجيل الدخول بنجاح!",
            loginError: "فشل تسجيل الدخول. حاول مرة أخرى.",
            invalidCreds: "بيانات الدخول غير صحيحة",
            serverDown: "الخادم غير متاح. الرجاء التحقق من تشغيله.",
            registerSuccess: "تم التسجيل بنجاح!",
            registerError: "فشل التسجيل. حاول مرة أخرى.",
            termsRequired: "يجب الموافقة على الشروط قبل التسجيل.",
            passwordMismatch: "كلمتا المرور غير متطابقتين!",
        },
    },
};

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
    const stored = sessionStorage.getItem("app-language");
    if (stored && dictionaries[stored]) {
        return stored;
    }

    const navigatorLang = navigator.language?.slice(0, 2) || "en";
    if (navigatorLang === "ar") return "ar";
    if (navigatorLang === "fr") return "fr";
    return "en";
};

const resolveValue = (dictionary, key) => {
    return key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), dictionary);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getInitialLanguage);

    useEffect(() => {
        sessionStorage.setItem("app-language", language);
        document.documentElement.setAttribute("lang", language);
        document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    }, [language]);

    const dictionary = useMemo(() => dictionaries[language] || dictionaries.en, [language]);

    const t = useMemo(
        () =>
            (key) => {
                const value = resolveValue(dictionary, key);
                if (value === null || value === undefined) {
                    return key;
                }
                return value;
            },
        [dictionary]
    );

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t,
            languages: [
                { code: "en", label: "English" },
                { code: "fr", label: "Français" },
                { code: "ar", label: "العربية" },
            ],
        }),
        [language, t]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

