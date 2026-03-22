/**
 * Escala tipografica baseada em Material Design 3 e boas praticas mobile.
 *
 * Regras gerais:
 * - Minimo legivel: 12sp (apenas metadados/helper)
 * - Texto de corpo: 14-16sp
 * - Inputs: 16sp (evita zoom automatico no iOS)
 * - Labels e botoes: 14sp medium
 * - Titulos de secao: 20-22sp
 * - Display/marca: 28sp+
 */

export const Typography = {
  // Mapeamento semantico -> variante MD3
  brand: 'headlineLarge', // 32sp — nome do app no hero
  screenTitle: 'titleLarge', // 22sp — titulos de tela
  sectionLabel: 'bodyMedium', // 14sp — "ou entre com e-mail", divisores
  body: 'bodyLarge', // 16sp — texto principal
  bodySecondary: 'bodyMedium', // 14sp — textos secundarios, links
  caption: 'bodySmall', // 12sp — apenas helper/erro (via HelperText)
} as const;
