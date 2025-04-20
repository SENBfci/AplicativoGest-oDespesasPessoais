export const COLORS = {
  // Cores principais
  primary: '#2196F3',      // Azul principal
  primaryLight: '#E3F2FD', // Azul claro
  secondary: '#64B5F6',    // Azul secundário
  error: '#DC3545',        // Vermelho para erros
  success: '#28A745',      // Verde para sucesso
  warning: '#FFC107',      // Amarelo para avisos
  info: '#17A2B8',         // Azul info

  // Cores de fundo
  background: '#F5F5F5',   // Cinza muito claro para fundo
  surface: '#FFFFFF',      // Branco para superfícies
  surfaceVariant: '#F8F8F8', // Cinza quase branco

  // Cores de texto
  text: {
    primary: '#1C1B1F',    // Quase preto para texto principal
    secondary: '#424242',  // Cinza escuro para texto secundário
    disabled: '#9E9E9E',   // Cinza médio para texto desabilitado
    hint: '#757575',       // Cinza para dicas/placeholders
  },

  // Cores de borda
  border: {
    default: '#E0E0E0',    // Cinza claro para bordas
    focus: '#2196F3',      // Azul para bordas com foco
  },

  // Status de transação
  transaction: {
    income: '#28A745',     // Verde para receitas
    expense: '#DC3545',    // Vermelho para despesas
  },

  // Categorias
  categories: {
    food: '#FF6B6B',          // Vermelho suave para Alimentação
    transport: '#4ECDC4',     // Verde água para Transporte
    housing: '#45B7D1',       // Azul claro para Moradia
    entertainment: '#96CEB4', // Verde menta para Lazer
    health: '#D4A5A5',        // Rosa suave para Saúde
    education: '#1E88E5',     // Azul para Educação (atualizado)
    shopping: '#E9B44C',      // Amarelo ocre para Compras
    others: '#9E9E9E',        // Cinza para Outros
  },
} as const;

// Removendo a tipagem estrita do ColorTheme
export type ColorTheme = {
  primary: string;
  primaryLight: string;
  secondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
  };
  border: {
    default: string;
    focus: string;
  };
  transaction: {
    income: string;
    expense: string;
  };
  categories: {
    food: string;
    transport: string;
    housing: string;
    entertainment: string;
    health: string;
    education: string;
    shopping: string;
    others: string;
  };
};

// Tema escuro agora usa a tipagem mais flexível
export const DARK_COLORS: ColorTheme = {
  // Cores principais
  primary: '#42A5F5',      // Azul mais claro para melhor contraste no dark
  primaryLight: '#1565C0', // Azul mais escuro para o tema dark
  secondary: '#90CAF9',    // Azul secundário mais claro
  error: '#CF6679',        // Vermelho adaptado para dark
  success: '#4CAF50',      // Verde adaptado
  warning: '#FFC107',      // Amarelo mantido
  info: '#2196F3',         // Azul info adaptado

  // Cores de fundo
  background: '#121212',    // Cinza muito escuro para fundo
  surface: '#1E1E1E',      // Cinza escuro para superfícies
  surfaceVariant: '#2D2D2D', // Cinza um pouco mais claro

  // Cores de texto
  text: {
    primary: '#FFFFFF',     // Branco para texto principal
    secondary: '#B3B3B3',   // Cinza claro para texto secundário
    disabled: '#666666',    // Cinza escuro para texto desabilitado
    hint: '#999999',        // Cinza médio para dicas
  },

  // Cores de borda
  border: {
    default: '#333333',     // Cinza escuro para bordas
    focus: '#42A5F5',       // Azul claro para bordas com foco
  },

  // Status de transação
  transaction: {
    income: '#4CAF50',      // Verde adaptado para dark
    expense: '#CF6679',     // Vermelho adaptado para dark
  },

  // Categorias (mantidas as mesmas cores para manter o reconhecimento visual)
  categories: {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    housing: '#45B7D1',
    entertainment: '#96CEB4',
    health: '#D4A5A5',
    education: '#42A5F5',   // Azul atualizado
    shopping: '#E9B44C',
    others: '#757575',
  },
}; 