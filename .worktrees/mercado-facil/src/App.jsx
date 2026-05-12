import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Minus, 
  Users, 
  ShoppingCart, 
  Receipt,
  ClipboardPaste,
  Wifi,
  WifiOff,
  Loader2,
  Share2
} from 'lucide-react';
import { auth, db, signInAnonymously } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const initialBuyers = [
  { id: '1', name: 'Família 1', heads: 4 },
  { id: '2', name: 'Família 2', heads: 3 },
  { id: '3', name: 'Família 3', heads: 2 },
];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados locais (sincronizados com a nuvem)
  const [pasteText, setPasteText] = useState('');
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [buyers, setBuyers] = useState(initialBuyers);
  
  // ID da lista (vinda da URL ou gerada)
  const [listId, setListId] = useState('');

  useEffect(() => {
    // Gerenciar ID da Lista
    const params = new URLSearchParams(window.location.search);
    let currentId = params.get('list');
    
    if (!currentId) {
      currentId = crypto.randomUUID().split('-')[0]; // ID curto
      params.set('list', currentId);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
    setListId(currentId);

    // Autenticação Anônima
    signInAnonymously(auth)
      .then((cred) => setUser(cred.user))
      .catch((err) => {
        console.error("Erro auth:", err);
        setError("Erro ao conectar ao servidor.");
      });
  }, []);

  useEffect(() => {
    if (!user || !listId) return;

    // Referência única para a lista compartilhada
    const docRef = doc(db, 'mercado_lists', listId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setItems(data.items || []);
        setBuyers(data.buyers || initialBuyers);
        setTotalAmount(data.totalAmount || '');
      } else {
        // Inicializa se não existir
        setDoc(docRef, { items: [], buyers: initialBuyers, totalAmount: '' });
      }
      setLoading(false);
    }, (err) => {
      console.error("Erro sync:", err);
      setError("Sem permissão ou erro de rede.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, listId]);

  // Função central para salvar
  const updateSharedState = async (updates) => {
    if (!user || !listId) return;
    const docRef = doc(db, 'mercado_lists', listId);
    
    const currentData = {
      items: updates.items !== undefined ? updates.items : items,
      buyers: updates.buyers !== undefined ? updates.buyers : buyers,
      totalAmount: updates.totalAmount !== undefined ? updates.totalAmount : totalAmount
    };

    try {
      await setDoc(docRef, currentData);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // --- Lógica de Ações ---

  const handleProcessText = () => {
    if (!pasteText.trim()) return;
    
    let cleanText = pasteText.trim();
    // Remove parênteses envolventes se a lista inteira estiver dentro deles
    if (cleanText.startsWith('(') && cleanText.endsWith(')')) {
      cleanText = cleanText.slice(1, -1);
    }

    const newItems = cleanText
      .split(/[\n,;]+/)
      .map(line => line.replace(/^[\s\-\*\•]+/, '').trim())
      .filter(line => line.length > 0)
      .map(text => ({
        id: crypto.randomUUID(),
        text,
        checked: false,
        timestamp: Date.now()
      }));
      
    const updated = [...items, ...newItems];
    setItems(updated);
    setPasteText('');
    updateSharedState({ items: updated });
  };

  const toggleItem = (id) => {
    const updated = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    setItems(updated);
    updateSharedState({ items: updated });
  };

  const removeItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    updateSharedState({ items: updated });
  };

  const clearChecked = () => {
    const updated = items.filter(i => !i.checked);
    setItems(updated);
    updateSharedState({ items: updated });
  };

  const shareList = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Minha Lista de Mercado',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para o WhatsApp!");
    }
  };

  // --- Lógica de Compradores ---
  const handleTotalChange = (val) => {
    setTotalAmount(val);
    updateSharedState({ totalAmount: val });
  };

  const addBuyer = () => {
    const updated = [...buyers, { id: crypto.randomUUID(), name: `Família ${buyers.length + 1}`, heads: 1 }];
    setBuyers(updated);
    updateSharedState({ buyers: updated });
  };

  const removeBuyer = (id) => {
    const updated = buyers.filter(b => b.id !== id);
    setBuyers(updated);
    updateSharedState({ buyers: updated });
  };

  const updateHeads = (id, delta) => {
    const updated = buyers.map(b => b.id === id ? { ...b, heads: Math.max(1, b.heads + delta) } : b);
    setBuyers(updated);
    updateSharedState({ buyers: updated });
  };

  const updateName = (id, newName) => {
    const updated = buyers.map(b => b.id === id ? { ...b, name: newName } : b);
    setBuyers(updated);
    updateSharedState({ buyers: updated });
  };

  // Cálculos
  const totalValue = parseFloat(totalAmount.replace(',', '.')) || 0;
  const totalHeads = buyers.reduce((sum, b) => sum + b.heads, 0);
  const costPerHead = totalHeads > 0 ? totalValue / totalHeads : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // --- Renderização de Telas de Estado ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-green-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-medium text-gray-600">Conectando à lista compartilhada...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={24} />
          <h1 className="text-xl font-bold">Mercado Fácil</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={shareList} className="p-1.5 hover:bg-green-700 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
          <div className="flex items-center gap-1 text-[10px] bg-green-700 px-2 py-1 rounded-full border border-green-500">
            {error ? <WifiOff size={12} className="text-red-300" /> : <Wifi size={12} className="text-green-300" />}
            <span>{error ? 'Erro' : 'Online'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* SEÇÃO 1: LISTA */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardPaste size={20} className="text-gray-600" />
              <h2 className="font-semibold text-gray-700">1. Lista Compartilhada ({listId})</h2>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              rows="3"
              placeholder="Cole aqui a lista do WhatsApp..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <button
              onClick={handleProcessText}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
            >
              Adicionar Itens na Nuvem
            </button>
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="px-4 py-2 flex justify-between items-center bg-gray-50">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {items.filter(i => i.checked).length} / {items.length} ITENS PEGOS
                </span>
                <button onClick={clearChecked} className="text-xs text-red-500 font-medium hover:text-red-700">
                  Limpar pegos
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {[...items].sort((a,b) => a.checked - b.checked).map(item => (
                  <li key={item.id} className={`flex items-center justify-between p-3 border-b border-gray-50 last:border-0 transition-all ${item.checked ? 'bg-green-50/50 opacity-60' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                      {item.checked ? <CheckCircle2 className="text-green-500" size={22} /> : <Circle className="text-gray-300" size={22} />}
                      <span className={`text-base ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.text}</span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* SEÇÃO 2: DIVISÃO */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
            <Receipt size={20} className="text-gray-600" />
            <h2 className="font-semibold text-gray-700">2. Rachar a Conta</h2>
          </div>
          <div className="p-4 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Total da Nota (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                className="w-full text-3xl font-bold border-none bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0,00"
                value={totalAmount}
                onChange={(e) => handleTotalChange(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase">Famílias / Compradores</label>
                <button onClick={addBuyer} className="text-xs text-green-600 font-bold flex items-center gap-1 hover:underline">
                  <Plus size={14} /> ADICIONAR
                </button>
              </div>
              {buyers.map((buyer) => (
                <div key={buyer.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={buyer.name}
                      onChange={(e) => updateName(buyer.id, e.target.value)}
                      className="bg-transparent font-bold text-gray-700 outline-none w-full border-b border-gray-200 focus:border-green-500"
                    />
                    {buyers.length > 1 && (
                      <button onClick={() => removeBuyer(buyer.id)} className="text-red-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Users size={14} /> Pessoas</div>
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <button onClick={() => updateHeads(buyer.id, -1)} className="px-3 py-1 hover:bg-gray-100 text-gray-500"><Minus size={14} /></button>
                      <div className="w-8 text-center font-bold text-sm">{buyer.heads}</div>
                      <button onClick={() => updateHeads(buyer.id, 1)} className="px-3 py-1 hover:bg-gray-100 text-gray-500"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-green-600 rounded-xl p-5 text-white shadow-lg shadow-green-200">
              <h3 className="text-xs font-bold uppercase opacity-80 mb-4">Resultado da Divisão</h3>
              <div className="flex justify-between items-end mb-4 border-b border-green-500 pb-4">
                <div>
                  <div className="text-[10px] opacity-80">POR PESSOA</div>
                  <div className="text-2xl font-bold">{formatCurrency(costPerHead)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] opacity-80">TOTAL DE PESSOAS</div>
                  <div className="text-xl font-bold">{totalHeads}</div>
                </div>
              </div>
              <div className="space-y-3">
                {buyers.map(buyer => (
                  <div key={buyer.id} className="flex justify-between items-center text-sm">
                    <span className="opacity-90">{buyer.name} ({buyer.heads})</span>
                    <span className="font-bold text-lg">{formatCurrency(buyer.heads * costPerHead)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
