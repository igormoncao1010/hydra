# Hydra | Strategy - Pré-teste de Criativos para Trafego Pago

Protótipo local para testar a propagação e a resposta social de um criativo antes de investir dinheiro em tráfego pago.

O sistema combina:

- Barabasi-Albert para gerar uma rede sintética com hubs de influ?ncia.
- Agentes sintéticos com renda, religião, região, profissão, família, interesses e comportamento probabilistico.
- Independent Cascade adaptado para engajamento, rejeição e indiferen?a.
- Monte Carlo para estimar alcance orgânico, rejeição, risco de desperd?cio e veredito de mídia.

## Como usar

Abra `index.html` no navegador.

Configure:

- quantidade de pessoas;
- conexões por novo no;
- rodadas Monte Carlo;
- sementes iniciais;
- opcionalmente, chave Hugging Face para diagnóstico com IA;
- nicho, canal, objetivo e ticket;
- produto ou serviço;
- público-alvo;
- estagio do público;
- objeção principal;
- prova social;
- garantia ou redutor de risco;
- verba planejada;
- headline, texto do anúncio, oferta e CTA;
- força da oferta;
- clareza da mensagem;
- atrito/pol?mica;
- aderência ao público.

O botao `Analisar com IA` chama a rota serverless `api/analyze-creative.js`. Em produção, essa rota usa `HF_TOKEN` configurado nas Environment Variables da Vercel. Não use `NEXT_PUBLIC_` no nome da chave, porque variaveis publicas ficam expostas no navegador.

A rota pede resposta JSON estruturada para reduzir falhas de parsing. Se o modelo devolver JSON incompleto, o Hydra mostra o motivo do fallback no relatório.

A análise gera:

- Hydra Score;
- score financeiro;
- score de aten??o;
- clareza;
- oferta;
- CTA;
- confiança;
- aderência ao público;
- risco de verba;
- veredito: revisar, testar ou escalar;
- gargalo principal;
- verba sugerida;
- plano de teste pago;
- matriz de criativos A/B;
- critérios de corte e escala;
- plano de ação;
- versão melhorada do criativo.

## Camada comercial

Depois de clicar em `Analisar com IA`, o Hydra tamb?m monta:

- `Decisão Comercial`: status, score financeiro, verba inicial sugerida, dias de teste, CTR/CPC/CPA estimados, risco de saturação, regra de corte e regra de escala.
- `Matriz de Testes`: quatro variações recomendadas para teste A/B, com ângulo, público, verba e métrica principal.
- `Previsto vs Real`: depois que a campanha real rodar, informe CTR, CPC, CPA, conversoes, verba gasta e comentários negativos para comparar previsão e performance real.
- `Histórico Local`: guarda no navegador as ultimas análises para consulta rapida.

## Deploy na Vercel

No painel da Vercel, configure:

```text
HF_TOKEN=hf_sua_chave
HF_MODEL=openai/gpt-oss-120b:cerebras
```

`HF_MODEL` e opcional. `HF_TOKEN` e obrigatorio para análise real via Hugging Face. Se ele não existir, o Hydra usa uma análise local de fallback.

Clique em `Rodar` para gerar uma nova população, uma nova rede e uma nova simulação.

## Imagem de compartilhamento

O projeto inclui:

- `og-image.png`: imagem usada nas tags Open Graph e Twitter Card.
- `og-image.svg`: versão editavel do layout.

As tags ficam no `index.html`. Se trocar para dominio proprio, a Vercel normalmente resolve `/og-image.png`; se algum validador exigir URL absoluta, substitua pelo dominio final.

Durante a execucao, o painel da rede mostra uma cascata observavel em tempo real:

- nos engajados aparecem coloridos por resposta;
- tentativas bem-sucedidas aparecem como conexões verdes;
- impressões frias aparecem como conexões vermelhas;
- os contadores mostram etapa, engajamentos, novos engajamentos e impressões frias.

Ao final da execucao, o sistema gera um relatório de pre-tráfego com:

- configuração experimental;
- estatísticas da rede Barabasi-Albert;
- medias e distribuições da população sintética;
- parâmetros do criativo;
- resultados agregados da cascata;
- hubs mais relevantes;
- plano de teste pago;
- matriz A/B;
- versoes criativas sugeridas;
- comparação previsto vs real, quando preenchida;
- banco sintético completo de personas;
- recomendação de mídia;
- limitacoes e proximas iteracoes.

Use `Copiar` para enviar o relatório para a área de transfer?ncia ou `Baixar PDF` para abrir a impressão do navegador formatada em A4. Na janela de impressão, escolha `Salvar como PDF`.

## Como alimentar o histórico real

Edite o arquivo:

```text
data/campaign-history.csv
```

Formato esperado:

```csv
niche,channel,objective,ctr,cpc,cpa,conversions,spend,result
cl?nica est?tica,Meta Ads,WhatsApp,3.2,1.5,18,12,300,bom
cl?nica est?tica,Meta Ads,WhatsApp,0.8,4.5,70,1,200,ruim
```

Depois de alterar o CSV:

1. faca commit no GitHub;
2. aguarde o redeploy da Vercel;
3. abra o Hydra;
4. o painel `Calibração Real` carregara automaticamente `/api/calibration`.

Quanto mais linhas reais, melhor:

- 10 campanhas parecidas: confiança media;
- 30 ou mais campanhas parecidas: confiança alta.

## Observação metodológica

Os perfis sao sintéticos. Caracter?sticas como região, religião e renda influ?nciam probabilidades, mas não determinam comportamento individual. O sistema deve ser usado como laborat?rio de cen?rios, triagem de criativos e apoio a decisão, não como garantia de performance em mídia paga.
