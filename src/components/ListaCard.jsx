import React, { useState, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  Circle,
  Trash2,
  ClipboardPaste,
  X,
} from 'lucide-react';
import { detectCategory, CATEGORIES, DEFAULT_CATEGORY } from '../categoryEngine';

// Agrupa itens por categoria
function groupByCategory(items) {
  const groups = {};
  items.forEach((item) => {
    const cat = detectCategory(item.text);
    if (!groups[cat.id]) {
      groups[cat.id] = { category: cat, items: [] };
    }
    groups[cat.id].items.push(item);
  });
  return Object.values(groups);
}

// Chip de filtro de categoria
function CategoryChip({ category, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`category-chip btn-ripple flex-shrink-0 ${
        active
          ? `${category.bgClass} ${category.borderClass} ${category.textClass}`
          : 'bg-white/5 border-white/10 text-slate-400'
      }`}
    >
      <span>{category.emoji}</span>
      <span>{category.label}</span>
    </button>
  );
}

// Componente de item individual
function ListItem({ item, onToggle, onRemove }) {
  const [bouncing, setBouncing] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const category = detectCategory(item.text);

  const handleToggle = useCallback(() => {
    setBouncing(true);
    setFlashing(true);
    setTimeout(() => setBouncing(false), 500);
    setTimeout(() => setFlashing(false), 400);
    onToggle(item.id);
  }, [item.id, onToggle]);

  return (
    <li
      className={`list-item divider-subtle ${flashing ? 'animate-haptic' : ''} ${
        item.checked ? 'list-item-checked' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
          onClick={handleToggle}
        >
          <span className={bouncing ? 'animate-check-bounce' : ''}>
            {item.checked ? (
              <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
            ) : (
              <Circle size={22} className="text-slate-600 flex-shrink-0" />
            )}
          </span>
          <span
            className={`text-sm leading-snug truncate ${
              item.checked
                ? 'line-through text-slate-500'
                : 'text-slate-200'
            }`}
          >
            {item.text}
          </span>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 btn-ripple rounded-lg"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}

export default function ListaCard({
  items,
  listId,
  pasteText,
  setPasteText,
  onProcessText,
  onToggleItem,
  onRemoveItem,
  onClearChecked,
}) {
  const [activeFilter, setActiveFilter] = useState(null); // null = todos
  const textareaRef = useRef(null);

  // Categorias que realmente aparecem nos itens
  const presentCategoryIds = [...new Set(items.map((i) => detectCategory(i.text).id))];
  const presentCategories = [
    ...(presentCategoryIds.includes('outros') ? [DEFAULT_CATEGORY] : []),
    ...CATEGORIES.filter((c) => presentCategoryIds.includes(c.id)),
  ];

  // Filtragem por categoria ativa
  const filteredItems = activeFilter
    ? items.filter((i) => detectCategory(i.text).id === activeFilter)
    : items;

  // Itens não marcados primeiro
  const sortedFiltered = [...filteredItems].sort((a, b) => a.checked - b.checked);

  // Agrupamento para exibição (somente quando "Todos" selecionado)
  const grouped = activeFilter ? null : groupByCategory(sortedFiltered);

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <section className="card-glow-list overflow-hidden">
      {/* Header do card */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <ClipboardPaste size={16} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-sm leading-none">Lista Compartilhada</h2>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">#{listId}</p>
          </div>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={onClearChecked}
            className="flex items-center gap-1 text-[11px] text-red-400/80 hover:text-red-400 font-medium transition-colors btn-ripple px-2 py-1 rounded-lg"
          >
            <X size={12} /> Limpar pegos
          </button>
        )}
      </div>

      {/* Input para colar lista */}
      <div className="p-4 space-y-3">
        <textarea
          ref={textareaRef}
          className="w-full bg-slate-900/60 border border-white/8 rounded-xl p-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 resize-none transition-all"
          rows={3}
          placeholder="Cole aqui a lista do WhatsApp..."
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <button
          onClick={onProcessText}
          disabled={!pasteText.trim()}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30 btn-ripple active:scale-[0.98] text-sm"
        >
          Adicionar à Lista
        </button>
      </div>

      {/* Área de itens */}
      {items.length > 0 && (
        <div className="border-t border-white/5">
          {/* Contador */}
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              {checkedCount} de {items.length} pegos
            </span>
            {/* Barra de progresso */}
            <div className="flex-1 mx-3 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: items.length > 0 ? `${(checkedCount / items.length) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Chips de filtro de categoria */}
          {presentCategories.length > 1 && (
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto slim-scroll">
              <button
                onClick={() => setActiveFilter(null)}
                className={`category-chip btn-ripple flex-shrink-0 ${
                  !activeFilter
                    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                🛒 Todos
              </button>
              {presentCategories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  active={activeFilter === cat.id}
                  onClick={() => setActiveFilter(activeFilter === cat.id ? null : cat.id)}
                />
              ))}
            </div>
          )}

          {/* Lista de itens */}
          <ul className="max-h-80 overflow-y-auto slim-scroll">
            {activeFilter || !grouped
              ? // Modo filtrado: lista plana
                sortedFiltered.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    onToggle={onToggleItem}
                    onRemove={onRemoveItem}
                  />
                ))
              : // Modo todos: agrupado por categoria
                grouped.map(({ category, items: catItems }) => (
                  <React.Fragment key={category.id}>
                    {/* Header de categoria */}
                    <div
                      className={`category-header ${category.bgClass} ${category.borderClass} ${category.textClass}`}
                      style={{ borderBottomColor: `${category.glowColor}` }}
                    >
                      <span>{category.emoji}</span>
                      <span>{category.label}</span>
                      <span className="ml-auto opacity-60">{catItems.length}</span>
                    </div>
                    {[...catItems]
                      .sort((a, b) => a.checked - b.checked)
                      .map((item) => (
                        <ListItem
                          key={item.id}
                          item={item}
                          onToggle={onToggleItem}
                          onRemove={onRemoveItem}
                        />
                      ))}
                  </React.Fragment>
                ))}
          </ul>
        </div>
      )}
    </section>
  );
}
