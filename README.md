# 🍽️ Cantina FIAP - App de Pedidos (CP2)

Sistema de pedidos para a cantina FIAP com autenticação de usuários, persistência de dados e gerenciamento de estado global.

## 📋 Sobre o Projeto

**CP2** é a evolução do MVP desenvolvido no CP1. O app foi transformado em uma aplicação robusta com:

- ✅ **Autenticação funcional** com cadastro, login e logout
- ✅ **Persistência de dados** local com AsyncStorage
- ✅ **Gerenciamento de estado global** com Context API
- ✅ **Formulários com validação** inline de campos
- ✅ **UX/UI aprimorada** com feedback visual e hierarquia tipográfica
- ✅ **Segurança** com armazenamento de token em SecureStore

## 🎯 Requisitos Atendidos

### Obrigatórios CP1 (Mantidos Funcionando)
- [x] Projeto iniciado com Expo CLI
- [x] Componentes reutilizáveis (components/)
- [x] Estrutura organizada (screens, context, constants, etc.)
- [x] Estilização com StyleSheet
- [x] 3 telas distintas com navegação
- [x] Navegação funcional entre todas as telas

### Obrigatórios CP2 (Novos)
- [x] **Autenticação com AsyncStorage**
  - Tela de Cadastro com validação (nome, email, senha, confirmação)
  - Tela de Login com credenciais validadas
  - Dados persistidos no AsyncStorage
  - Logout com limpeza de sessão
  - Sessão persistida ao reabrir app

- [x] **Persistência de Dados**
  - Pedidos salvos localmente com histórico
  - Dados sobrevivem ao fechamento do app
  - Carregamento automático de dados

- [x] **Context API**
  - AuthContext: gerencia usuário, login, logout
  - OrderContext: gerencia pedidos e histórico
  - Proteção de rotas: usuário não logado não acessa o app

- [x] **Validação de Formulários**
  - Validação inline com mensagens de erro em vermelho
  - Botões desabilitados com erros
  - Validações: obrigatório, formato email, mínimo 6 caracteres, correspondência de senhas

- [x] **UX/UI Aprimorada**
  - Hierarquia visual clara (H1, H2, Body, Small)
  - Paleta de cores coerente (primária, sucesso, erro, neutros)
  - Espaçamento consistente
  - Loading spinners, mensagens de sucesso/erro
  - Telas vazias com EmptyState
  - KeyboardAvoidingView para não cobrir campos

### Diferencial Técnico ⭐

#### 🔒 Expo SecureStore

**O que é:**
Este projeto implementa `expo-secure-store` para armazenar o token de autenticação de forma segura, em vez de usar AsyncStorage puro.

**Por quê?**
- AsyncStorage armazena dados em **texto plano** no sistema de arquivos local
- SecureStore usa mecanismos **criptográficos nativos**:
  - **iOS:** Keychain da Apple (AES-256)
  - **Android:** Keystore do Android (protocolo de criptografia)

**Benefícios:**
- ✅ Proteção contra acesso direto ao armazenamento (USB Debugging, etc.)
- ✅ Proteção contra engenharia reversa do app
- ✅ Padrão de segurança de produção
- ✅ Qualquer app real que lida com credenciais deve usar SecureStore

**Implementação:**
```typescript
// Ao fazer login, salvar token seguro
await saveToken(token);
await saveUserId(userId);

// Ao abrir app, recuperar token seguro
const token = await getToken();

// Ao fazer logout, limpar token seguro
await clearSecureStorage();
```

## 📱 Funcionalidades

### Telas Implementadas

1. **Tela de Login** (`app/(auth)/login.tsx`)
   - E-mail e senha com validação
   - Link para criar conta
   - Mensagens de erro inline
   - Loading state durante autenticação

2. **Tela de Cadastro** (`app/(auth)/cadastro.tsx`)
   - Nome completo, email, senha, confirmação
   - Validação em tempo real
   - Sucesso com redirecionamento para login
   - Erros com mensagens específicas

3. **Tela Inicial** (`app/(tabs)/index.tsx`)
   - Problema real e contexto do app
   - Status de pico (horário de almoço)
   - Informações da equipe

4. **Tela de Cardápio** (`app/(tabs)/explore.tsx`)
   - Itens disponíveis com preços
   - Adicionar ao carrinho
   - Exibir total de itens

5. **Tela de Pedido** (`app/(tabs)/pedido.tsx`)
   - Itens do pedido atual
   - Status em tempo real (em preparação → pronto)
   - Botão de confirmação de retirada

6. **Tela de Histórico** (`app/(tabs)/historico.tsx`) ⭐ NOVO
   - Lista de pedidos anteriores
   - Data e hora de cada pedido
   - Status do pedido (em preparação, pronto, retirado)
   - Tela vazia com mensagem quando sem pedidos

7. **Tela de Perfil** (`app/(tabs)/perfil.tsx`) ⭐ NOVO
   - Avatar com iniciais
   - Exibir dados: nome, email
   - Editar perfil com validação
   - Alterar senha com validação
   - Logout com confirmação

## 🏗️ Estrutura do Projeto

```
meuApp/
├── app/
│   ├── _layout.tsx                    # Root layout com proteção de rotas
│   ├── (auth)/                        # Rotas de autenticação
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── cadastro.tsx
│   └── (tabs)/                        # Rotas do app principal
│       ├── _layout.tsx                # Tab navigation (5 abas)
│       ├── index.tsx
│       ├── explore.tsx
│       ├── pedido.tsx
│       ├── historico.tsx              # ⭐ NOVO
│       └── perfil.tsx                 # ⭐ NOVO
│
├── components/                        # Componentes reutilizáveis
│   ├── AppHeader.tsx
│   ├── ValidatedInput.tsx             # ⭐ NOVO
│   ├── ErrorCard.tsx                  # ⭐ NOVO
│   ├── LoadingSpinner.tsx             # ⭐ NOVO
│   ├── SuccessMessage.tsx             # ⭐ NOVO
│   ├── EmptyState.tsx                 # ⭐ NOVO
│   └── ...outros
│
├── context/
│   ├── AuthContext.tsx                # ⭐ NOVO - Autenticação global
│   └── OrderContext.tsx               # Modificado - Com persistência
│
├── services/
│   ├── storage.ts                     # ⭐ NOVO - AsyncStorage
│   └── secureStorage.ts               # ⭐ NOVO - SecureStore (diferencial)
│
├── utils/
│   └── validation.ts                  # ⭐ NOVO - Funções de validação
│
├── constants/
│   ├── theme.ts                       # Cores e tema
│   └── typography.ts                  # ⭐ NOVO - Tipografia
│
├── assets/
│   └── images/                        # Logo, ícones, splash
│
├── package.json                       # Dependências
├── app.json                           # Configuração Expo
└── README.md                          # Este arquivo
```

## 🚀 Como Executar

### Instalação
```bash
cd meuApp
npm install  # ou yarn install
```

### Desenvolvimento
```bash
npx expo start
```

Escaneie o QR code com:
- **iOS:** Câmera padrão do iPhone
- **Android:** Expo Go app

### Build
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 🔐 Fluxo de Autenticação

```
1. App inicia
   ↓
2. AuthContext verifica se há token válido no SecureStore
   ├─ SIM → Carrega usuário logado → Mostra (tabs)
   └─ NÃO → Mostra (auth)

3. Usuário sem conta:
   → Clica "Criar conta"
   → Preenche Cadastro
   → Valida campos
   → Salva no AsyncStorage
   → Redireciona para Login

4. Usuário com conta:
   → Preenche Login
   → Valida credenciais contra AsyncStorage
   → Gera token
   → Salva token no SecureStore (criptografado)
   → Redireciona para (tabs)

5. App reaberto:
   → Token é recuperado do SecureStore
   → Usuário continua logado automaticamente

6. Logout:
   → Limpa SecureStore
   → Limpa SessionID
   → Retorna para Login
```

## 📊 Validações Implementadas

### Cadastro
- ✅ Nome: obrigatório, mínimo 3 caracteres
- ✅ E-mail: obrigatório, formato válido (usuario@dominio.com)
- ✅ Senha: obrigatório, mínimo 6 caracteres
- ✅ Confirmação: deve ser idêntica à senha

### Login
- ✅ E-mail: obrigatório, formato válido
- ✅ Senha: obrigatório, mínimo 6 caracteres

### Editar Perfil
- ✅ Nome: obrigatório, mínimo 3 caracteres
- ✅ E-mail: obrigatório, formato válido, não duplicado

### Alterar Senha
- ✅ Senha atual: deve corresponder
- ✅ Nova senha: mínimo 6 caracteres

## 🎨 Paleta de Cores

```
Primária:      #ed145b (Rosa neon)
Sucesso:       #10b981 (Verde)
Erro:          #ef4444 (Vermelho)
Aviso:         #f59e0b (Amarelo)
Fundo:         #0b0b0b (Preto)
Fundo Light:   #1f2937 (Cinza escuro)
Texto Primary: #ffffff (Branco)
Texto Sec:     #9ca3af (Cinza claro)
Border:        #374151 (Cinza médio)
```

## 🔄 Persistência de Dados

### AsyncStorage
- **Usuários:** Lista de usuários cadastrados
- **Histórico de Pedidos:** Todos os pedidos do app
- **Sessão Ativa:** ID do usuário logado

### SecureStore
- **Token:** Token de autenticação (criptografado)
- **User ID:** ID do usuário logado (criptografado)

## 📦 Dependências Principais

```json
{
  "expo": "^54.0.33",
  "expo-router": "^6.0.23",
  "react": "^19.1.0",
  "react-native": "^0.81.5",
  "@react-native-async-storage/async-storage": "^1.x",
  "expo-secure-store": "^14.0.0",
  "@expo/vector-icons": "^14.0.0"
}
```

## ✅ Checklist de Testes

### Funcional
- [ ] Cadastro com validação funciona
- [ ] Login aceita credenciais corretas
- [ ] Login rejeita credenciais incorretas
- [ ] Logout limpa sessão e retorna para login
- [ ] App reaberto mostra usuário logado
- [ ] Histórico lista pedidos anteriores
- [ ] Editar perfil atualiza dados
- [ ] Alterar senha funciona

### Visual
- [ ] Cores consistentes em todas as telas
- [ ] Hierarquia tipográfica clara
- [ ] Espaçamento uniforme
- [ ] Loading spinners funcionam
- [ ] Mensagens de erro aparecem inline
- [ ] Teclado não cobre campos
- [ ] Ícones consistentes

## 📝 Notas

- Senhas são armazenadas em **texto plano** por simplicidade no CP2. Em produção, usar hash (bcrypt, scrypt).
- SecureStore é o diferencial técnico deste projeto, garantindo segurança desde o início.
- Validação ocorre em tempo real conforme o usuário digita nos campos obrigatórios.
- O app está pronto para integração com backend real (API).

## 👥 Desenvolvedor

Desenvolvido como parte do **Checkpoint 2** do curso de React Native na FIAP.

---

**Última atualização:** 2026-04-26
