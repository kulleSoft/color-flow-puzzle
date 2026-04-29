## Objetivo
Adicionar um efeito visual de líquido sendo derramado de um tubo para outro quando o jogador faz uma jogada — atualmente a transferência é instantânea (apenas as bolhas no tubo de destino indicam a ação).

## Como vai funcionar

Quando o jogador toca em um tubo válido para receber líquido:

1. O tubo de origem **se inclina** em direção ao tubo de destino (rotação ~70° + se aproxima dele).
2. Um **fluxo de líquido animado** (uma faixa colorida) sai da boca do tubo de origem e cai até a boca do tubo de destino.
3. Os segmentos de cor saem do topo do tubo de origem e entram no topo do destino, sincronizados com a duração da queda.
4. O tubo de origem volta à posição normal.
5. Total da animação: ~700–900ms.

## Mudanças técnicas

### `src/components/WaterSortGame.tsx`
- Adicionar estado `pouring: { from: number; to: number; color: string } | null`.
- No `handleTubeClick`, quando `canPour` for verdadeiro:
  - Setar `pouring`, tocar som.
  - Atrasar a atualização de `tubes` (`setTubes`) até a animação concluir (~700ms) usando `setTimeout`.
  - Limpar `pouring` ao final.
- Passar para cada `<Tube>` props extras: `isPouringFrom`, `isPouringTo`, `pourTargetOffset` (vetor x/y entre origem e destino calculado via `getBoundingClientRect` em `useRef`s por tubo) e a cor que está sendo despejada.
- Travar novos cliques enquanto `pouring !== null`.

### `src/components/Tube.tsx`
- Adicionar `forwardRef` para que o pai meça posição.
- Quando `isPouringFrom`:
  - Animar `rotate` (ex.: `to.rotate = side === 'left' ? -70 : 70`) e `x/y` para se aproximar da boca do tubo destino, com `framer-motion` (`type: spring` ou `tween` 250ms ida + 250ms volta).
  - Renderizar um elemento de "fluxo" — um `div` absoluto saindo da boca do tubo, com gradiente vertical na cor do líquido despejado, animando `scaleY` de 0 → 1 → 0 e altura proporcional à distância até o destino.
- Quando `isPouringTo`: manter as bolhas (já existem) e talvez um leve "ripple" no topo.
- Durante o pour, não exibir o segmento que saiu do topo da origem nem ainda o que está chegando no destino (visualmente representado pelo fluxo) — passar uma prop `hideTopSegment` na origem e `previewIncoming` no destino opcional.

### `src/lib/gameLogic.ts`
- Sem mudanças.

## Detalhes visuais
- Lado da inclinação: comparar `rect.x` da origem vs destino; inclinar para o lado do destino.
- Cor do fluxo: cor do topo do tubo de origem (`tube[tube.length - 1]`).
- Largura do fluxo: ~30% da largura interna do tubo, com leve `border-radius` e `box-shadow` na cor para parecer brilhante/liquido.
- Pequeno "splash" (3–4 partículas circulares) ao chegar no destino, reaproveitando o componente `Bubbles` existente.

## Fora do escopo
- Animação de física real do líquido (ondulação 2D). Mantemos uma faixa simples + bolhas para custo baixo.
- Mudanças no layout/estilo dos tubos.
