# Hydra | Strategy - Pre-teste de Criativos para Trafego Pago

Prototipo local para testar a propagacao e a resposta social de um criativo antes de investir dinheiro em trafego pago.

O sistema combina:

- Barabasi-Albert para gerar uma rede sintetica com hubs de influencia.
- Agentes sinteticos com renda, religiao, regiao, profissao, familia, interesses e comportamento probabilistico.
- Independent Cascade adaptado para engajamento, rejeicao e indiferenca.
- Monte Carlo para estimar alcance organico, rejeicao, risco de desperdicio e veredito de midia.

## Como usar

Abra `index.html` no navegador.

Configure:

- quantidade de pessoas;
- conexoes por novo no;
- rodadas Monte Carlo;
- sementes iniciais;
- opcionalmente, chave Hugging Face para diagnostico com IA;
- nicho, canal, objetivo e ticket;
- produto ou servico;
- publico-alvo;
- estagio do publico;
- objecao principal;
- prova social;
- garantia ou redutor de risco;
- verba planejada;
- headline, texto do anuncio, oferta e CTA;
- forca da oferta;
- clareza da mensagem;
- atrito/polemica;
- aderencia ao publico.

O botao `Analisar com IA` chama a rota serverless `api/analyze-creative.js`. Em producao, essa rota usa `HF_TOKEN` configurado nas Environment Variables da Vercel. Nao use `NEXT_PUBLIC_` no nome da chave, porque variaveis publicas ficam expostas no navegador.

A analise gera:

- Hydra Score;
- score de atencao;
- clareza;
- oferta;
- CTA;
- confianca;
- aderencia ao publico;
- risco de verba;
- veredito: revisar, testar ou escalar;
- gargalo principal;
- verba sugerida;
- plano de acao;
- versao melhorada do criativo.

## Deploy na Vercel

No painel da Vercel, configure:

```text
HF_TOKEN=hf_sua_chave
HF_MODEL=openai/gpt-oss-120b:cerebras
```

`HF_MODEL` e opcional. `HF_TOKEN` e obrigatorio para analise real via Hugging Face. Se ele nao existir, o Hydra usa uma analise local de fallback.

Clique em `Rodar` para gerar uma nova populacao, uma nova rede e uma nova simulacao.

Durante a execucao, o painel da rede mostra uma cascata observavel em tempo real:

- nos engajados aparecem coloridos por resposta;
- tentativas bem-sucedidas aparecem como conexoes verdes;
- impressoes frias aparecem como conexoes vermelhas;
- os contadores mostram etapa, engajamentos, novos engajamentos e impressoes frias.

Ao final da execucao, o sistema gera um relatorio de pre-trafego com:

- configuracao experimental;
- estatisticas da rede Barabasi-Albert;
- medias e distribuicoes da populacao sintetica;
- parametros do criativo;
- resultados agregados da cascata;
- hubs mais relevantes;
- recomendacao de midia;
- limitacoes e proximas iteracoes.

Use `Copiar` para enviar o relatorio para a area de transferencia ou `Baixar PDF` para abrir a impressao do navegador formatada em A4. Na janela de impressao, escolha `Salvar como PDF`.

## Observacao metodologica

Os perfis sao sinteticos. Caracteristicas como regiao, religiao e renda influenciam probabilidades, mas nao determinam comportamento individual. O sistema deve ser usado como laboratorio de cenarios e triagem de criativos, nao como previsao exata de performance.
