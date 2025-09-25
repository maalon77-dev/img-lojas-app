# Configuração do AI Image Studio Builder

## 🔑 Configuração da API Key

Para usar o sistema de geração de imagens, você precisa configurar a API Key do Google Gemini:

### Passo 1: Obter a API Key
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### Passo 2: Configurar no Projeto
1. Crie um arquivo `.env` na raiz do projeto
2. Adicione a seguinte linha:
```
REACT_APP_GEMINI_API_KEY=sua_chave_aqui
```

### Passo 3: Reiniciar o Servidor
Após configurar a API key, reinicie o servidor:
```bash
npm start
```

## 🚀 Como Usar

### Modo Criação
1. Selecione "Criar" no painel esquerdo
2. Escolha uma função (Livre, Thumbnail, Logo, Banner)
3. Digite seu prompt descrevendo a imagem
4. Selecione a proporção desejada
5. Adicione estilos opcionais
6. Clique em "Gerar Imagem"

### Modo Edição
1. Selecione "Editar" no painel esquerdo
2. Escolha uma função de edição
3. Faça upload da imagem
4. Descreva as modificações
5. Clique em "Gerar Imagem"

### Funcionalidades Especiais
- **Variações**: Gere versões alternativas da mesma imagem
- **Histórico**: Acesse suas criações anteriores
- **Download**: Baixe em PNG, JPG ou WebP
- **Interface Mobile**: Modal especial para dispositivos móveis

## 🎨 Dicas de Prompts

### Para Thumbnails
- Use cores vibrantes e contrastantes
- Inclua texto legível
- Foque em elementos que chamam atenção
- Exemplo: "Thumbnail para vídeo sobre tecnologia, cores azul e laranja, texto 'IA REVOLUCIONÁRIA'"

### Para Logos
- Seja específico sobre o estilo
- Mencione cores da marca
- Exemplo: "Logo moderno para empresa de tecnologia, minimalista, cores azul e branco"

### Para Banners
- Considere o formato e proporção
- Use elementos que transmitam a mensagem
- Exemplo: "Banner promocional para produto, estilo moderno, cores vibrantes"

## 🔧 Solução de Problemas

### Erro de API Key
- Verifique se o arquivo `.env` está na raiz do projeto
- Confirme se a variável está nomeada corretamente
- Reinicie o servidor após alterações

### Erro de Geração
- Verifique sua conexão com a internet
- Confirme se a API key é válida
- Tente prompts mais simples

### Problemas de Interface
- Limpe o cache do navegador
- Verifique se o JavaScript está habilitado
- Teste em um navegador diferente

## 📱 Compatibilidade

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Tablet**: iPad, Android tablets

## 🆘 Suporte

Se você encontrar problemas:
1. Verifique se seguiu todos os passos de configuração
2. Confirme se todas as dependências foram instaladas
3. Teste com prompts simples primeiro
4. Verifique a documentação da API do Gemini
