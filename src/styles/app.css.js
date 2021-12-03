import { globalStyle, createGlobalTheme } from '@vanilla-extract/css';

import { theme } from './theme.css';


globalStyle('body', {
	backgroundColor: theme.palette.gray[100],
});

createGlobalTheme(':root', theme, {
	palette: {
		black: '#000000',
		white: '#ffffff',

		gray: {
			50: '#F9FAFB',
			100: '#F3F4F6',
			200: '#E5E7EB',
			300: '#D1D5DB',
			400: '#9CA3AF',
			500: '#6B7280',
			600: '#4B5563',
			700: '#374151',
			800: '#1F2937',
			900: '#111827',
		},

		red: {
			50: '#FEF2F2',
			100: '#FEE2E2',
			200: '#FECACA',
			300: '#FCA5A5',
			400: '#F87171',
			500: '#EF4444',
			600: '#DC2626',
			700: '#B91C1C',
			800: '#991B1B',
			900: '#7F1D1D',
		},

		blue: {
			50: '#EFF6FF',
			100: '#DBEAFE',
			200: '#BFDBFE',
			300: '#93C5FD',
			400: '#60A5FA',
			500: '#3B82F6',
			600: '#2563EB',
			700: '#1D4ED8',
			800: '#1E40AF',
			900: '#1E3A8A',
		},

		pink: {
			50: '#FDF2F8',
			100: '#FCE7F3',
			200: '#FBCFE8',
			300: '#F9A8D4',
			400: '#F472B6',
			500: '#EC4899',
			600: '#DB2777',
			700: '#BE185D',
			800: '#9D174D',
			900: '#831843',
		},

		green: {
			50: '#ECFDF5',
			100: '#D1FAE5',
			200: '#A7F3D0',
			300: '#6EE7B7',
			400: '#34D399',
			500: '#10B981',
			600: '#059669',
			700: '#047857',
			800: '#065F46',
			900: '#064E3B',
		},

		yellow: {
			50: '#FFFBEB',
			100: '#FEF3C7',
			200: '#FDE68A',
			300: '#FCD34D',
			400: '#FBBF24',
			500: '#F59E0B',
			600: '#D97706',
			700: '#B45309',
			800: '#92400E',
			900: '#78350F',
		},
	},

	shadow: {
		main: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
		small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
	},
});
