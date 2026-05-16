# ROM Finder 📱

O **ROM Finder** é uma ferramenta completa para usuários de Android que desejam encontrar Custom ROMs de forma rápida e automática.

## 🚀 Funcionalidades

- **Busca Inteligente:** Procure por modelo de celular ou codename.
- **Resultados em Tempo Real:** Puxa dados de uma base local e integra automaticamente com APIs externas (ex: Pixel Experience).
- **Interface Premium:** Design moderno com glassmorphism, modo escuro e animações suaves.
- **Links Diretos:** Acesso rápido a downloads e guias de instalação.

## 🛠️ Tecnologias

- **Frontend:** React + Vite + Framer Motion + Lucide Icons.
- **Backend:** Node.js + Express + Axios.
- **Estilização:** CSS Moderno (Vanilla).

## 💻 Como Rodar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/rom-finder.git
cd rom-finder
```

### 2. Rodar o Backend
```bash
cd backend
npm install
node server.js
```
O servidor rodará em `http://localhost:3001`.

### 3. Rodar o Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Acesse em `http://localhost:5173`.

## 🌐 Deploy (Como solicitado)

### Frontend (GitHub Pages)
1. No diretório `frontend`, instale o pacote gh-pages:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Adicione os scripts no `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Execute `npm run deploy`.

### Backend (Render / Railway)
1. Crie uma conta no [Render](https://render.com/).
2. Conecte seu repositório GitHub.
3. Escolha o diretório `backend` como root.
4. Comando de build: `npm install`.
5. Comando de start: `node server.js`.

## 🔴 Integração Automática (Scraping/API)

Atualmente, o backend possui:
1. **Base JSON Local:** Lista curada de dispositivos populares.
2. **API Pixel Experience:** Busca automática no banco de dados oficial do Pixel Experience.
3. **Escalabilidade:** O código está preparado para integrar APIs do LineageOS, Evolution X e outros fóruns via scraping com `cheerio`.

---
Desenvolvido com ❤️ para a comunidade Android.
