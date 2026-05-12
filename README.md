# 🛒 Mercado Fácil ACKER

Modernização do protótipo Mercado Fácil para uma aplicação web progressiva, colaborativa e em tempo real.

## 🔗 Links Oficiais
- **Site Online:** [https://mercado-facil.netlify.app/](https://mercado-facil.netlify.app/)
- **Repositório GitHub:** [https://github.com/Ackerss/Mercado-Facil-Acker-efc3a](https://github.com/Ackerss/Mercado-Facil-Acker-efc3a)

## 🚀 Tecnologias Utilizadas
- **Frontend:** React + Vite
- **Estilização:** Tailwind CSS v4 (Design moderno e responsivo)
- **Backend/Database:** Firebase Firestore (Sincronização em tempo real)
- **Autenticação:** Firebase Auth (Login Anônimo)
- **Deployment:** Netlify

## ✨ Funcionalidades Principais
1. **Sincronização em Tempo Real:** Várias pessoas podem editar a mesma lista simultaneamente. Mudanças feitas por um usuário aparecem instantaneamente para os outros.
2. **Compartilhamento Dinâmico:** Cada lista tem um ID único na URL. Basta copiar e enviar o link para um amigo.
3. **Divisão de Compras (Rachar a Conta):** Interface integrada para calcular a divisão do valor total entre os membros da família/grupo.
4. **Interface Mobile-First:** Design otimizado para uso em smartphones dentro do supermercado.

## 🛠️ Configuração do Ambiente (Guia para Futuras IAs)
Para que o projeto funcione, as seguintes configurações foram feitas no Console do Firebase:

### 1. Firebase Authentication
- O método **Login Anônimo** deve estar ativado.
- Isso permite que os usuários usem o app sem precisar criar conta com e-mail, mas mantendo a segurança da conexão.

### 2. Cloud Firestore
- O banco de dados foi criado em **Modo de Teste** (leitura/escrita liberada).
- Estrutura de dados:
  - Coleção: `lists` -> Documento: `{listId}` -> Sub-coleção: `items`.

### 3. Chaves de API
- As chaves estão configuradas diretamente no arquivo `src/firebase.js`.
- Em ambiente profissional, estas chaves devem ser movidas para variáveis de ambiente `.env`.

## 📦 Comandos Disponíveis
- `npm install`: Instala as dependências.
- `npm run dev`: Inicia o servidor de desenvolvimento local.
- `npm run build`: Gera a versão de produção na pasta `dist/`.

---
Desenvolvido com excelência por **Antigravity AI** em parceria com **Ackerss**.
