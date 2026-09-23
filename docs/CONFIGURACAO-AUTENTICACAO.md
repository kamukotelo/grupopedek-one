# Configuração da autenticação PEPEK

O frontend suporta e-mail/palavra-passe, telefone com código SMS, Google, Microsoft e Apple. As credenciais dos provedores são configuradas apenas no Supabase; nunca devem ser adicionadas ao frontend ou ao repositório.

## Supabase

1. Em **Authentication > URL Configuration**, definir a URL oficial como `Site URL` e adicionar `http://localhost:5173/painel` e a URL oficial terminada em `/painel` às Redirect URLs.
2. Em **Authentication > Providers**, ativar Email e Phone. Ligar um fornecedor SMS suportado pelo Supabase (por exemplo, Twilio, Vonage ou MessageBird) e manter limites de envio por IP/utilizador.
3. Ativar Google e inserir Client ID/Secret. No Google Cloud, autorizar o callback exibido pelo Supabase: `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Ativar Azure (Microsoft), inserir Client ID/Secret e usar o mesmo callback no Microsoft Entra ID. Permitir `openid`, `profile` e `email`.
5. Ativar Apple, inserir Services ID e Secret. Configurar o mesmo callback em **Sign in with Apple**. O secret Apple expira e deve ser renovado antes da data configurada.
6. Configurar CAPTCHA no Supabase para reduzir abuso de criação de contas e custos de SMS. Confirmar também os limites de OTP e a validade do código.

## Variáveis do site

Definir `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` conforme `.env.example`. A chave `service_role` é exclusiva das funções do servidor e não pode ter prefixo `VITE_`.

## Verificação antes de produção

- Executar `npm run test:auth`, `npm test` e `npm run build`.
- Testar cada provedor numa janela privada, incluindo cancelamento e retorno à rota `/painel`.
- Testar SMS real em números de Angola e Portugal e confirmar que reenvio/expiração obedecem aos limites.
- Confirmar criação de `public.profiles` e que toda nova conta recebe apenas o papel `cliente_normal`.
- Confirmar recuperação de palavra-passe, saída e persistência da sessão após recarregar a página.
