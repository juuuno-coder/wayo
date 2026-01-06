import { createContext, useContext } from 'react';

export type FontStyle = 'sans' | 'serif' | 'hand';
export type TextEffect = 'none' | 'shadow' | 'outline' | 'neon';

export interface ThemeSettings {
    themeColor: string;
    fontStyle: FontStyle;
    textEffect?: TextEffect;
}

export const ThemeContext = createContext<ThemeSettings | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            themeColor: '#3E2723', // Default classic brown
            fontStyle: 'sans' as FontStyle,
            textEffect: 'none' as TextEffect,
        };
    }
    return context;
};
