// useCurrencyInput.js — Hook para input de moeda BRL (R$)
// Usuário digita apenas números, o hook formata automaticamente como "1.234,56"

import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar input de moeda brasileira (BRL).
 * @param {number} initialValue - Valor inicial em número (ex: 150.50)
 * @returns {{ displayValue: string, rawValue: number, handleChange: function, setValue: function }}
 */
export function useCurrencyInput(initialValue = 0) {
  const formatToBRL = (cents) => {
    if (!cents || cents === 0) return '';
    const value = cents / 100;
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Armazena em centavos internamente para evitar problemas de float
  const [cents, setCents] = useState(() => Math.round(initialValue * 100));

  const handleChange = useCallback((e) => {
    // Remove tudo que não for dígito
    const digits = e.target.value.replace(/\D/g, '');
    const newCents = parseInt(digits || '0', 10);
    setCents(newCents);
  }, []);

  const setValue = useCallback((numericValue) => {
    setCents(Math.round((parseFloat(numericValue) || 0) * 100));
  }, []);

  return {
    displayValue: formatToBRL(cents),
    rawValue: cents / 100,
    handleChange,
    setValue,
    cents,
  };
}
