import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../i18n/index.js';

const LANGUAGE_KEY = '@zentree_language';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved language on mount
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
                if (saved && translations[saved]) {
                    setLanguageState(saved);
                }
            } catch (error) {
                console.error('Failed to load language:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadLanguage();
    }, []);

    // Set language and persist
    const setLanguage = async (lang) => {
        try {
            setLanguageState(lang);
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    };

    // Translation function
    const t = (key) => {
        const value = translations[language]?.[key];
        if (value === undefined) {
            console.warn(`Missing translation: "${key}" for language "${language}"`);
            return translations['en']?.[key] || key;
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
