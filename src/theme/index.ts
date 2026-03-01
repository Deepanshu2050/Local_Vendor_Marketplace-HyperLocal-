import {
    MD3LightTheme,
    MD3DarkTheme,
    configureFonts,
    MD3Theme,
} from 'react-native-paper';

// ─── Material 3 Custom Color Palette ────────
const brandColors = {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
    background: '#FFFBFE',
    onBackground: '#1C1B1F',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#D0BCFF',
    elevation: {
        level0: 'transparent',
        level1: '#F7F2FA',
        level2: '#F3EDF7',
        level3: '#EFE9F4',
        level4: '#EDE7F2',
        level5: '#EBE4F0',
    },
    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
};

const darkBrandColors = {
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    tertiaryContainer: '#633B48',
    onTertiaryContainer: '#FFD8E4',
    error: '#F2B8B5',
    onError: '#601410',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F9DEDC',
    background: '#141218',
    onBackground: '#E6E0E9',
    surface: '#141218',
    onSurface: '#E6E0E9',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    outlineVariant: '#49454F',
    inverseSurface: '#E6E0E9',
    inverseOnSurface: '#313033',
    inversePrimary: '#6750A4',
    elevation: {
        level0: 'transparent',
        level1: '#1D1A25',
        level2: '#22202D',
        level3: '#272435',
        level4: '#292637',
        level5: '#2C293D',
    },
    surfaceDisabled: 'rgba(230, 224, 233, 0.12)',
    onSurfaceDisabled: 'rgba(230, 224, 233, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
};

// ─── Typography ─────────────────────────────
const fontConfig = {
    displayLarge: { fontFamily: 'System', fontSize: 57, fontWeight: '400' as const, letterSpacing: -0.25, lineHeight: 64 },
    displayMedium: { fontFamily: 'System', fontSize: 45, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 52 },
    displaySmall: { fontFamily: 'System', fontSize: 36, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 44 },
    headlineLarge: { fontFamily: 'System', fontSize: 32, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 40 },
    headlineMedium: { fontFamily: 'System', fontSize: 28, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 36 },
    headlineSmall: { fontFamily: 'System', fontSize: 24, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 32 },
    titleLarge: { fontFamily: 'System', fontSize: 22, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 28 },
    titleMedium: { fontFamily: 'System', fontSize: 16, fontWeight: '500' as const, letterSpacing: 0.15, lineHeight: 24 },
    titleSmall: { fontFamily: 'System', fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.1, lineHeight: 20 },
    bodyLarge: { fontFamily: 'System', fontSize: 16, fontWeight: '400' as const, letterSpacing: 0.5, lineHeight: 24 },
    bodyMedium: { fontFamily: 'System', fontSize: 14, fontWeight: '400' as const, letterSpacing: 0.25, lineHeight: 20 },
    bodySmall: { fontFamily: 'System', fontSize: 12, fontWeight: '400' as const, letterSpacing: 0.4, lineHeight: 16 },
    labelLarge: { fontFamily: 'System', fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.1, lineHeight: 20 },
    labelMedium: { fontFamily: 'System', fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5, lineHeight: 16 },
    labelSmall: { fontFamily: 'System', fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5, lineHeight: 16 },
};

// ─── Themes ─────────────────────────────────
export const lightTheme: MD3Theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...brandColors,
    },
    fonts: configureFonts({ config: fontConfig }),
    roundness: 16,
};

export const darkTheme: MD3Theme = {
    ...MD3DarkTheme,
    dark: true,
    colors: {
        ...MD3DarkTheme.colors,
        ...darkBrandColors,
    },
    fonts: configureFonts({ config: fontConfig }),
    roundness: 16,
};

// ─── Spacing Scale ──────────────────────────
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

// ─── App-specific Extended Colors ───────────
export const appColors = {
    success: '#2E7D32',
    successContainer: '#C8E6C9',
    onSuccess: '#FFFFFF',
    warning: '#F57F17',
    warningContainer: '#FFF9C4',
    onWarning: '#FFFFFF',
    info: '#0288D1',
    infoContainer: '#B3E5FC',
    onInfo: '#FFFFFF',
    star: '#FFB300',
    verified: '#4CAF50',
    pending: '#FF9800',
    cancelled: '#F44336',
} as const;
