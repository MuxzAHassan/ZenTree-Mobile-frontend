import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext.js';

export default function LanguageSelector() {
    const { language, setLanguage, t } = useLanguage();
    const [open, setOpen] = useState(false);

    const currentLabel = language === 'en' ? 'EN' : 'BM';

    const options = [
        { code: 'en', label: t('lang.en') },
        { code: 'ms', label: t('lang.ms') },
    ];

    const handleSelect = (code) => {
        setLanguage(code);
        setOpen(false);
    };

    return (
        <View style={styles.wrapper}>
            {/* Toggle button */}
            <TouchableOpacity style={styles.toggleButton} onPress={() => setOpen(!open)}>
                <Text style={styles.toggleText}>🌐 {currentLabel}</Text>
            </TouchableOpacity>

            {/* Dropdown modal */}
            <Modal
                visible={open}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.dropdown}>
                                {options.map((opt) => (
                                    <TouchableOpacity
                                        key={opt.code}
                                        style={[
                                            styles.option,
                                            language === opt.code && styles.optionActive,
                                        ]}
                                        onPress={() => handleSelect(opt.code)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                language === opt.code && styles.optionTextActive,
                                            ]}
                                        >
                                            {opt.label}
                                        </Text>
                                        {language === opt.code && (
                                            <Text style={styles.check}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    toggleButton: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 95,
        paddingRight: 20,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 6,
        minWidth: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionActive: {
        backgroundColor: '#FFF3E6',
    },
    optionText: {
        fontSize: 15,
        color: '#333',
    },
    optionTextActive: {
        color: '#B5651D',
        fontWeight: '600',
    },
    check: {
        fontSize: 16,
        color: '#B5651D',
        fontWeight: 'bold',
    },
});
