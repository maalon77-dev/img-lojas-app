# AI Image Studio Builder - Invente com IA Edition

Um estúdio completo de criação de imagens com inteligência artificial, construído com React e TypeScript.

## 🚀 Funcionalidades

### Modo Criação
- **Livre**: Criação livre com prompts personalizados
- **Thumbnail**: Criação otimizada para thumbnails do YouTube
- **Logo**: Criação de logos profissionais
- **Banner**: Criação de banners promocionais

### Modo Edição
- **Adicionar/Remover**: Adicionar ou remover elementos das imagens
- **Retoque**: Melhorar qualidade e aplicar filtros
- **Estilo**: Transformar imagens em diferentes estilos artísticos
- **Unir**: Combinar duas imagens em uma

### Recursos Avançados
- **Múltiplas Proporções**: 1:1, 16:9, 9:16, 4:3, 3:4, 21:9
- **Estilos Artísticos**: Cinematográfico, 8K, Realista, Ilustração
- **Histórico**: Salva as últimas 12 criações
- **Variações**: Gera variações das imagens criadas
- **Download**: Múltiplos formatos (PNG, JPG, WebP)
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Google Gemini AI** - Geração de imagens
- **Lucide React** - Ícones modernos

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd ai-image-studio
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a API Key do Gemini:
```bash
cp .env.example .env
# Edite o arquivo .env e adicione sua chave da API do Gemini
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## 🔑 Configuração da API

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API Key
3. Adicione a chave no arquivo `.env`:
```
REACT_APP_GEMINI_API_KEY=sua_chave_aqui
```

## 🎨 Como Usar

### Criando uma Imagem
1. Selecione o modo "Criar"
2. Escolha a função desejada (Livre, Thumbnail, Logo, Banner)
3. Digite seu prompt descrevendo a imagem
4. Selecione a proporção desejada
5. Adicione estilos opcionais
6. Clique em "Gerar Imagem"

### Editando uma Imagem
1. Selecione o modo "Editar"
2. Escolha a função de edição
3. Faça upload da imagem
4. Descreva as modificações desejadas
5. Clique em "Gerar Imagem"

### Funcionalidades Especiais
- **Variações**: Clique em "Variação" para gerar versões alternativas
- **Histórico**: Acesse imagens anteriores clicando no painel de histórico
- **Download**: Baixe em diferentes formatos usando os botões de download

## 📱 Interface Responsiva

A aplicação foi desenvolvida com foco na experiência mobile:
- Layout adaptativo para diferentes tamanhos de tela
- Modal especial para ações em dispositivos móveis
- Interface touch-friendly
- Otimizada para performance

## 🎯 Próximas Funcionalidades

- [ ] Integração com mais APIs de IA
- [ ] Editor de imagens integrado
- [ ] Templates pré-definidos
- [ ] Colaboração em tempo real
- [ ] Exportação em lote
- [ ] Integração com redes sociais

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se a API Key está configurada corretamente
2. Confirme se todas as dependências foram instaladas
3. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para democratizar a criação de imagens com IA**
