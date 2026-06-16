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

A rota pede resposta JSON estruturada para reduzir falhas de parsing. Se o modelo devolver JSON incompleto, o Hydra mostra o motivo do fallback no relatorio.

A analise gera:

- Hydra Score;
- score financeiro;
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
- plano de teste pago;
- matriz de criativos A/B;
- criterios de corte e escala;
- plano de acao;
- versao melhorada do criativo.

## Camada comercial

Depois de clicar em `Analisar com IA`, o Hydra tambem monta:

- `Decisao Comercial`: status, score financeiro, verba inicial sugerida, dias de teste, CTR/CPC/CPA estimados, risco de saturacao, regra de corte e regra de escala.
- `Matriz de Testes`: quatro variacoes recomendadas para teste A/B, com angulo, publico, verba e metrica principal.
- `Previsto vs Real`: depois que a campanha real rodar, informe CTR, CPC, CPA, conversoes, verba gasta e comentarios negativos para comparar previsao e performance real.
- `Historico Local`: guarda no navegador as ultimas analises para consulta rapida.

## Deploy na Vercel

No painel da Vercel, configure:

```text
HF_TOKEN=hf_sua_chave
HF_MODEL=openai/gpt-oss-120b:cerebras
```

`HF_MODEL` e opcional. `HF_TOKEN` e obrigatorio para analise real via Hugging Face. Se ele nao existir, o Hydra usa uma analise local de fallback.

Clique em `Rodar` para gerar uma nova populacao, uma nova rede e uma nova simulacao.

## Imagem de compartilhamento

O projeto inclui:

- `og-image.png`: imagem usada nas tags Open Graph e Twitter Card.
- `og-image.svg`: versao editavel do layout.

As tags ficam no `index.html`. Se trocar para dominio proprio, a Vercel normalmente resolve `/og-image.png`; se algum validador exigir URL absoluta, substitua pelo dominio final.

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
- plano de teste pago;
- matriz A/B;
- versoes criativas sugeridas;
- comparacao previsto vs real, quando preenchida;
- banco sintetico completo de personas;
- recomendacao de midia;
- limitacoes e proximas iteracoes.

Use `Copiar` para enviar o relatorio para a area de transferencia ou `Baixar PDF` para abrir a impressao do navegador formatada em A4. Na janela de impressao, escolha `Salvar como PDF`.

## Como alimentar o historico real

Edite o arquivo:

```text
data/campaign-history.csv
```

Formato esperado:

```csv
niche,channel,objective,ctr,cpc,cpa,conversions,spend,result
clinica estetica,Meta Ads,WhatsApp,3.2,1.5,18,12,300,bom
clinica estetica,Meta Ads,WhatsApp,0.8,4.5,70,1,200,ruim
```

Depois de alterar o CSV:

1. faca commit no GitHub;
2. aguarde o redeploy da Vercel;
3. abra o Hydra;
4. o painel `Calibracao Real` carregara automaticamente `/api/calibration`.

Quanto mais linhas reais, melhor:

- 10 campanhas parecidas: confianca media;
- 30 ou mais campanhas parecidas: confianca alta.

## Observacao metodologica

Os perfis sao sinteticos. Caracteristicas como regiao, religiao e renda influenciam probabilidades, mas nao determinam comportamento individual. O sistema deve ser usado como laboratorio de cenarios, triagem de criativos e apoio a decisao, nao como garantia de performance em midia paga.
