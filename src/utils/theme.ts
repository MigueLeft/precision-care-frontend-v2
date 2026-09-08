import { createTheme } from '@mui/material/styles'

// Paleta de marca definida en reglas_estilos.md
const BRAND = {
  primary: '#046ea3',
  dark: '#001d4a',
  accent: '#00cccc',
  soft: '#b9d6f2',
} as const

// Altura de un MenuItem estándar (48px) y padding vertical de la lista del menú (8px).
// Limitamos los desplegables de todos los Select a 5 items visibles; a partir de ahí aparece scroll.
const MENU_ITEM_HEIGHT = 48
const MENU_LIST_PADDING = 8
const MAX_VISIBLE_SELECT_ITEMS = 5
const SELECT_MENU_MAX_HEIGHT = MENU_ITEM_HEIGHT * MAX_VISIBLE_SELECT_ITEMS + MENU_LIST_PADDING

declare module '@mui/material/styles' {
  interface Palette {
    brand: { dark: string; accent: string; soft: string }
  }
  interface PaletteOptions {
    brand?: { dark: string; accent: string; soft: string }
  }
}

export const theme = createTheme({
  palette: {
    brand: {
      dark: BRAND.dark,
      accent: BRAND.accent,
      soft: BRAND.soft,
    },
    primary: {
      main: BRAND.primary,
      dark: '#035880',
      light: '#2d8ab5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: BRAND.accent,
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',   // gray-900
      secondary: '#6b7280', // gray-500
    },
    divider: '#e5e7eb', // gray-200
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
  },
  shape: {
    borderRadius: 6, // rounded-md por defecto
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    // Escala según reglas_estilos.md
    h1: { fontSize: '22px', fontWeight: 600, color: BRAND.dark, lineHeight: 1.3 },
    h2: { fontSize: '18px', fontWeight: 600, lineHeight: 1.4 },
    h3: { fontSize: '16px', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '14px', fontWeight: 600, lineHeight: 1.5 },
    h5: { fontSize: '14px', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '12px', fontWeight: 600, lineHeight: 1.5 },
    subtitle1: { fontSize: '14px', fontWeight: 600 },
    subtitle2: { fontSize: '12px', fontWeight: 600 },
    body1: { fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '12px', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '12px', fontWeight: 400, color: '#6b7280' },
    button: { fontSize: '14px', fontWeight: 600, textTransform: 'none' },
  },
  components: {
    // Sin sombras — separación por bordes
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e5e7eb' },
        rounded: { borderRadius: '8px' }, // rounded-lg para cards
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: "'Montserrat', sans-serif",
          borderRadius: '6px',
          padding: '10px 20px',
          lineHeight: 1.4,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
    },
    // Todos los Select (incluidos los de TextField select) muestran como máximo
    // 5 items; con más items la lista hace scroll.
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          slotProps: {
            paper: { style: { maxHeight: SELECT_MENU_MAX_HEIGHT } },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px',
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db', // gray-300
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9ca3af', // gray-400
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND.accent,
            borderWidth: '2px',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ef4444',
          },
        },
        input: {
          padding: '12px 14px',
          '&::placeholder': {
            fontStyle: 'italic',
            color: '#9ca3af', // gray-400
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: '14px',
          color: '#374151', // gray-700
          '&.Mui-focused': { color: BRAND.dark },
          '&.Mui-error': { color: '#ef4444' },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px',
          marginTop: '4px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#e5e7eb' },
      },
    },
    // Tabs: borde inferior brand-primary en tab activa
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 400,
          fontSize: '14px',
          textTransform: 'none',
          color: '#6b7280',
          '&.Mui-selected': {
            fontWeight: 600,
            color: BRAND.primary,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: BRAND.primary, height: '2px' },
      },
    },
    // Chips / Badges
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: '12px',
          borderRadius: '4px', // no pill
          height: '22px',
        },
      },
    },
  },
})
