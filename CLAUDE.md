# Mercado Fácil ACKER — Contexto para IAs

## Repositório e Deploy

- **GitHub:** https://github.com/Ackerss/Mercado-Facil-Acker-efc3a (conta: Ackerss)
- **URL online:** https://mercado-facil.netlify.app
- **Deploy:** automático via Netlify. Push em `main` = deploy em ~2 min
- **Remote Netlify:** `git push netlify main`

## O que é o projeto

Lista de compras colaborativa em tempo real. Várias pessoas editam a mesma lista simultaneamente via link compartilhado (`?list=XYZ`). Também tem divisão de conta ("Rachar a Conta").

## Stack

React 19 + Vite 8 + TailwindCSS v4 (@tailwindcss/vite) + Firebase Firestore + Auth Anônimo + Lucide React

## Estrutura

```
src/
  App.jsx           — toda a lógica de UI + Firebase
  firebase.js       — config Firebase (chaves expostas intencionalmente para deploy fácil)
  components/
    ListaCard.jsx   — card de lista de compras
    RacharCard.jsx  — card de divisão de conta
  hooks/
  categoryEngine.js — categorização de itens
  index.css         — @import "tailwindcss" (v4!)
```

## Firebase

- Coleção: `mercado_lists`
- O mesmo Firebase é compartilhado com o app unificado (`../mercado-acker_unificado/`)
- Listas criadas aqui aparecem no app unificado automaticamente (mesmo listId)

## ⚠️ TailwindCSS v4 — sintaxe obrigatória

`src/index.css` deve ter:
```css
@import "tailwindcss";
```
Não use `@tailwind base/components/utilities` — isso é v3 e quebra o app.

## ⚠️ Git e Deploy

- Netlify escuta branch `main`. Sempre pushe para `main`.
- Antes de pushar: `git pull netlify main --rebase` para não perder correções do remoto
- No PowerShell use `;` entre comandos em vez de `&&`

## ⚠️ Ecossistema de 3 Apps — LEIA ANTES DE AGIR

Este projeto **não está sozinho**. Existe um terceiro app que copia o código desta pasta:

- **App unificado:** `../mercado-acker_unificado/`
- **Documentação completa:** `../mercado-acker_unificado/LEIA_PRIMEIRO.md`

**Regra:** Edite livremente aqui. Para propagar pro app unificado:
```bash
cd "../mercado-acker_unificado"
npm run sync:lista
git add . && git commit -m "sync: atualiza aba lista" && git push
```

## Usuário

Jacson — dono da NatuBrava (loja de produtos naturais). Email: jacsonsax@gmail.com
