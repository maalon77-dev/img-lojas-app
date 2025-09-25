# 🚀 Deploy no Vercel - AI Image Studio Builder

## 📋 Pré-requisitos

1. **Conta no Vercel**: [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Para conectar o repositório
3. **API Key do Gemini**: Já configurada

## 🔧 Passos para Deploy

### Opção 1: Deploy via Interface Web (Recomendado)

1. **Acesse o Vercel**: [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Importe o Projeto**:
   - Clique em "New Project"
   - Conecte seu repositório Git
   - Selecione o repositório `ai-image-studio`

3. **Configure as Variáveis de Ambiente**:
   - Na seção "Environment Variables"
   - Adicione: `REACT_APP_GEMINI_API_KEY`
   - Valor: `AIzaSyDSkiWwMWcZqcLd4_Fe56_nsH0IW32k8YQ`

4. **Configurações de Build**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o processo (2-3 minutos)

### Opção 2: Deploy via CLI

1. **Login no Vercel**:
```bash
vercel login
```

2. **Configure as Variáveis**:
```bash
vercel env add REACT_APP_GEMINI_API_KEY
# Cole: AIzaSyDSkiWwMWcZqcLd4_Fe56_nsH0IW32k8YQ
```

3. **Deploy**:
```bash
vercel --prod
```

## ⚙️ Configurações Importantes

### Build Settings
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Environment Variables
```
REACT_APP_GEMINI_API_KEY=AIzaSyDSkiWwMWcZqcLd4_Fe56_nsH0IW32k8YQ
```

### Domain Settings
- O Vercel fornecerá um domínio automático
- Exemplo: `ai-image-studio-abc123.vercel.app`
- Você pode configurar um domínio customizado

## 🔄 Deploy Automático

Após configurar, cada push para a branch principal fará deploy automático:

1. **Push para main/master**:
```bash
git add .
git commit -m "feat: deploy to vercel"
git push origin main
```

2. **Vercel detecta mudanças** e faz deploy automático

## 📱 Funcionalidades no Deploy

✅ **Todas as funcionalidades funcionam**:
- Geração de imagens com IA
- Modo Criação e Edição
- Histórico persistente
- Download em múltiplos formatos
- Interface responsiva
- Modal mobile

## 🛠️ Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se a API key está configurada

### Erro de API
- Verifique se `REACT_APP_GEMINI_API_KEY` está nas variáveis de ambiente
- Confirme se a API key é válida

### Erro de Domínio
- Aguarde alguns minutos para propagação DNS
- Verifique se o domínio está configurado corretamente

## 📊 Monitoramento

- **Analytics**: Disponível no dashboard do Vercel
- **Logs**: Acesse via dashboard para debug
- **Performance**: Métricas automáticas

## 🔒 Segurança

- API key está protegida nas variáveis de ambiente
- Não exposta no código fonte
- HTTPS automático no Vercel

---

**🎉 Após o deploy, sua aplicação estará disponível globalmente!**
