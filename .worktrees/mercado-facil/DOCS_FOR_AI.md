# 🧠 Guia Técnico para IA (Contexto do Projeto)

Este documento serve para fornecer contexto imediato a qualquer IA que for trabalhar neste projeto no futuro.

## Arquitetura de Sincronização
- **Real-time:** Utilizamos o hook `onSnapshot` do Firebase Firestore. 
- **Listas Compartilhadas:** O `listId` é extraído dos parâmetros da URL (`?list=xyz`). Se não houver, o app gera um novo.
- **Estado Local vs Remoto:** O estado do React é sincronizado automaticamente com o Firestore. Adições e remoções são feitas via `addDoc` e `deleteDoc`.

## Estrutura de Arquivos
- `src/App.jsx`: Contém toda a lógica de UI e integração com Firebase.
- `src/firebase.js`: Configuração do SDK do Firebase. **Importante:** As chaves de API estão expostas aqui intencionalmente para facilitar o deploy inicial do usuário.
- `netlify.toml`: Garante que o Netlify faça o build corretamente usando `npm run build` e publique a pasta `dist`.

## Dependências Críticas
- `firebase`: SDK oficial para banco de dados e auth.
- `lucide-react`: Ícones da interface.
- `framer-motion`: (Se adicionado) Para animações suaves.
- `tailwindcss`: Estilização via classes utilitárias (v4).

## Fluxo de Deploy
O projeto está configurado para deploy contínuo no Netlify. Qualquer `push` no repositório GitHub (`master` ou `main`) disparará um novo build automático.

---
**Status Atual:** Projeto entregue, online e funcional.
