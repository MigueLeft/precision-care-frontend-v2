# React + TypeScript + Vite

## Contabilidad de citas

El módulo `/contabilidad` requiere `contabilidad:read`. Permite registrar cobros con
`contabilidad:create`, ajustar importes pendientes con `contabilidad:update` y anular
pagos con `contabilidad:delete`. Los permisos se asignan desde Usuarios y roles.

- En Especialistas → Ajustar precio se configura la tarifa individual. Al elegir un
  especialista en una cita se propone esa tarifa y se puede editar el precio y descuento.
- Catálogos → Métodos de pago administra nombres, colores y disponibilidad. Sus acciones
  usan los permisos `catalogos:create/read/update/delete`.
- Los importes se manejan en USD y se redondean a dos decimales. Un precio vacío significa
  que falta definirlo; cero representa una cita gratuita. Un descuento no modifica el precio base.
- Los cobros guardan el método y especialista de ese momento. La tarifa estándar posterior
  no modifica citas previas. Para corregir un cobro se anula con un motivo y se registra de nuevo.
- Auditoría usa por defecto el mes actual. Los ingresos corresponden a la fecha del pago;
  las cuentas por cobrar, a la fecha de la cita. Se excluyen cancelaciones y ausencias
  de las cuentas por cobrar. Las fechas incluyen ambos días y usan la zona horaria local.
- Las citas anteriores sin tarifa se señalan como pendientes de precio y no suman un importe
  inventado. Las anulaciones conservan el historial y actualizan el resumen vigente.

Antes de usarlo, el backend debe incluir el módulo y las migraciones de contabilidad.
El módulo de backend y sus migraciones están en la rama `dev` del repositorio
`precision-care-backend-v2`. Confirma la base de desarrollo antes de aplicar allí
`pnpm run db:migrate`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
