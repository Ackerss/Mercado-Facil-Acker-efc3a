# ⚠️ ATENÇÃO IA — LEIA ANTES DE MEXER NESTE PROJETO

## Este projeto faz parte de um ecossistema de 3 apps

O **Mercado Fácil ACKER** é um dos dois projetos que alimentam um terceiro app chamado **Mercado Acker Unificado**.

```
C:\Users\User\Meu Drive\ANTIGRAVITY\
│
├── Mercado Facil ACKER\          ← VOCÊ ESTÁ AQUI
│   └── (lista colaborativa, Firebase, tempo real)
│
├── mercado_preçobaixo_app\       ← Projeto irmão
│   └── (comparador de preços, Gemini OCR)
│
└── mercado-acker_unificado\      ← App que junta os dois
    └── (copia o código desta pasta via npm run sync)
```

---

## O QUE VOCÊ PODE FAZER AQUI

✅ **Edite livremente** — refatore, corrija bugs, adicione features.  
✅ As mudanças feitas aqui **não quebram o app unificado** automaticamente.  
✅ O app unificado só se atualiza quando o Jacson rodar `npm run sync` lá.

---

## O QUE VOCÊ NÃO DEVE FAZER

❌ **Não mova nem renomeie esta pasta.**  
O app unificado (`../mercado-acker_unificado/`) depende do caminho exato:  
`C:\Users\User\Meu Drive\ANTIGRAVITY\Mercado Facil ACKER\`

Se precisar mover, avise o Jacson e atualize `SOURCES.lista` em:  
`../mercado-acker_unificado/scripts/sync-features.mjs`

---

## SOBRE ESTE PROJETO

**O que faz:** Lista de compras colaborativa em tempo real.  
Várias pessoas editam a mesma lista simultaneamente via link compartilhado.  
Também tem divisão de conta ("rachar").

**Stack:** React 19 + Vite 8 + TailwindCSS v4 + Firebase Firestore + Auth Anônimo

**Deploy:** [mercado-facil.netlify.app](https://mercado-facil.netlify.app)  
**Repositório:** [github.com/Ackerss/Mercado-Facil-Acker-efc3a](https://github.com/Ackerss/Mercado-Facil-Acker-efc3a)  
**Deploy automático:** push em `main` → Netlify faz deploy em ~2 min

**Firebase:** configurado em `src/firebase.js`. Coleção: `mercado_lists`.  
O mesmo Firebase é compartilhado com o app unificado — listas criadas aqui aparecem lá também.

---

## TAILWINDCSS v4 — AVISO IMPORTANTE

Sintaxe **CORRETA** (v4) em `src/index.css`:
```css
@import "tailwindcss";
```

Sintaxe **ERRADA** (v3 — quebra o app):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## COMO PROPAGAR MUDANÇAS PRO APP UNIFICADO

Depois de fazer push aqui:

```bash
# Vá na pasta do app unificado e rode:
cd "../mercado-acker_unificado"
npm run sync:lista
npm run dev       # testa
git add . && git commit -m "sync: atualiza aba lista" && git push
```

---

*Documentação gerada em 2026-05-14 pelo Mercado Acker Unificado.*  
*Para contexto completo, veja: `../mercado-acker_unificado/LEIA_PRIMEIRO.md`*
