import React, { useState } from 'react';
import { Receipt, Users, Plus, Minus, Trash2 } from 'lucide-react';
import { useCurrencyInput } from '../hooks/useCurrencyInput';

// Formata moeda em BRL para exibição
const formatBRL = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

// Card de um comprador individual
function BuyerCard({ buyer, onRemove, onUpdateHeads, onUpdateName, costPerHead, canRemove }) {
  const total = buyer.heads * costPerHead;
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 space-y-3 animate-item-enter">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={buyer.name}
          onChange={(e) => onUpdateName(buyer.id, e.target.value)}
          className="flex-1 bg-transparent text-slate-800 font-semibold text-sm outline-none border-b border-slate-200 focus:border-violet-500 pb-1 transition-colors"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(buyer.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors btn-ripple rounded-lg"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Users size={13} />
          <span>Pessoas</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Valor deste comprador */}
          {costPerHead > 0 && (
            <span className="text-sm font-bold text-violet-600">{formatBRL(total)}</span>
          )}
          {/* Controle de quantidade */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => onUpdateHeads(buyer.id, -1)}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 transition-colors btn-ripple"
            >
              <Minus size={13} />
            </button>
            <div className="w-8 text-center font-bold text-slate-700 text-sm">{buyer.heads}</div>
            <button
              onClick={() => onUpdateHeads(buyer.id, 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 transition-colors btn-ripple"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RacharCard({
  buyers,
  totalAmount,
  onTotalChange,
  onAddBuyer,
  onRemoveBuyer,
  onUpdateHeads,
  onUpdateName,
}) {
  const totalValue = parseFloat(String(totalAmount).replace(',', '.')) || 0;
  const totalHeads = buyers.reduce((s, b) => s + b.heads, 0);
  const costPerHead = totalHeads > 0 ? totalValue / totalHeads : 0;

  // Hook de moeda BRL
  const currency = useCurrencyInput(totalValue);

  // Sincroniza valor para o pai quando muda
  const handleCurrencyChange = (e) => {
    currency.handleChange(e);
    // Extrai valor numérico dos dígitos digitados
    const digits = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(digits || '0', 10) / 100;
    onTotalChange(String(numericValue));
  };

  return (
    <section className="card-glow-split overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
          <Receipt size={16} className="text-violet-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-sm leading-none">Rachar a Conta</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Divisão automática por pessoa</p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Campo Total — Destaque Dourado */}
        <div>
          <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">
            💰 Total da Nota
          </label>
          <div className="input-total-container px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold text-xl flex-shrink-0">R$</span>
              <input
                type="text"
                inputMode="numeric"
                className="input-total"
                placeholder="0,00"
                value={currency.displayValue}
                onChange={handleCurrencyChange}
              />
            </div>
          </div>
        </div>

        {/* Lista de Compradores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Famílias / Compradores
            </label>
            <button
              onClick={onAddBuyer}
              className="flex items-center gap-1 text-[11px] text-violet-600 font-bold hover:text-violet-700 transition-colors btn-ripple px-2 py-1 rounded-lg"
            >
              <Plus size={13} /> Adicionar
            </button>
          </div>

          <div className="space-y-2.5">
            {buyers.map((buyer) => (
              <BuyerCard
                key={buyer.id}
                buyer={buyer}
                costPerHead={costPerHead}
                canRemove={buyers.length > 1}
                onRemove={onRemoveBuyer}
                onUpdateHeads={onUpdateHeads}
                onUpdateName={onUpdateName}
              />
            ))}
          </div>
        </div>

        {/* Resultado da Divisão */}
        {totalValue > 0 && (
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            {/* Header resultado */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 flex items-center justify-between border-b border-violet-100/50">
              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-widest">
                Resultado
              </span>
              <div className="text-right">
                <div className="text-[10px] text-slate-500">Por pessoa</div>
                <div className="text-lg font-bold text-violet-900">{formatBRL(costPerHead)}</div>
              </div>
            </div>

            {/* Lista de resultados por família */}
            <div className="divide-y divide-slate-100">
              {buyers.map((buyer) => (
                <div key={buyer.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="text-slate-700 text-sm font-medium">{buyer.name}</span>
                    <span className="text-slate-500 text-xs ml-2">
                      {buyer.heads} {buyer.heads === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>
                  <span className="font-bold text-base text-emerald-600">
                    {formatBRL(buyer.heads * costPerHead)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total geral */}
            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-200">
              <span className="text-slate-400 text-xs font-medium">
                {totalHeads} pessoas ao total
              </span>
              <span className="text-slate-800 font-bold text-sm">{formatBRL(totalValue)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
