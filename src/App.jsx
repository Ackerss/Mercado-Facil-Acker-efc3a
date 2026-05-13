import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Wifi, 
  WifiOff, 
  Loader2, 
  Share2 
} from 'lucide-react';
import { auth, db, signInAnonymously } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Componentes Premium
import ListaCard from './components/ListaCard';
import RacharCard from './components/RacharCard';

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
      currentId = crypto.randomUUID().split('-')[0];
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

    const docRef = doc(db, 'mercado_lists', listId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setItems(data.items || []);
        setBuyers(data.buyers || initialBuyers);
        setTotalAmount(data.totalAmount || '');
      } else {
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

  // --- Handlers para ListaCard ---
  const handleProcessText = () => {
    if (!pasteText.trim()) return;
    let cleanText = pasteText.trim();
    if (cleanText.startsWith('(') && cleanText.endsWith(')')) cleanText = cleanText.slice(1, -1);

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

  // --- Handlers para RacharCard ---
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

  const shareList = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Minha Lista de Mercado', url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-medium text-slate-400">Conectando ao Mercado Fácil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] pb-12 selection:bg-emerald-500/30">
      {/* Header Premium */}
      <header className="header-premium text-white p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
            <ShoppingCart size={22} className="text-emerald-300" />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight">MERCADO FÁCIL <span className="text-emerald-300 font-medium">ACKER</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={shareList} className="p-2 hover:bg-white/10 rounded-xl transition-all btn-ripple">
            <Share2 size={20} />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] bg-black/20 px-2.5 py-1.5 rounded-full border border-white/10">
            {error ? <WifiOff size={12} className="text-red-400" /> : <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            <span className="font-bold tracking-wider uppercase">{error ? 'Erro' : 'Cloud Sync'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <ListaCard 
          items={items}
          listId={listId}
          pasteText={pasteText}
          setPasteText={setPasteText}
          onProcessText={handleProcessText}
          onToggleItem={toggleItem}
          onRemoveItem={removeItem}
          onClearChecked={clearChecked}
        />

        <RacharCard 
          buyers={buyers}
          totalAmount={totalAmount}
          onTotalChange={handleTotalChange}
          onAddBuyer={addBuyer}
          onRemoveBuyer={removeBuyer}
          onUpdateHeads={updateHeads}
          onUpdateName={updateName}
        />

        <footer className="py-8 text-center">
          <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase opacity-50">
            Design Premium • PWA Mobile First
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
