# Plano: Redesign — mais moderno e simples

## Contexto
O design atual tem excesso visual: muitas cores por fonte, bordas coloridas, badges redundantes, sidebar com legend de ícones, dots e shortNames, topbar densa. O pedido é simplificar e modernizar — menos ruído, mais respiro, hierarquia clara.

## Direção

**Paleta reduzida**
- Fundo: `#0c0c0e` (quase preto neutro)
- Card/superfície: `#141417`
- Borda: `rgba(255,255,255,0.06)` — uma só cor, sem bordas coloridas por fonte
- Texto primário: `#f0f0f4`, muted: `#666680`
- Accent único: `#7c3aed` (violeta) — só para elementos interativos e foco
- Remover as 6 cores individuais por fonte; manter apenas um dot pequeno para identificação

**Layout — o que muda**
- Topbar: logo menor + texto "Animex", searchbar centralizado, toggle grid/lista. Sem badges BETA, sem contador de loading na topbar.
- Sidebar: mais limpa — só nome da fonte + contador, sem description text, sem kind badges, sem legend. Toggle de ativar/desativar vira um simples checkbox estilizado.
- Cards (grid): poster + título embaixo + score + status. Sem overlay complexo, sem badges DUB/SUB em destaque. Hover: leve elevação de borda.
- Lista: linha simples — thumbnail pequeno, título, score, tipo, episódios. Sem muitas tags.
- Seções de resultado: só o nome da fonte em texto neutro (sem cor individual), contador à direita, linha separadora simples.

**O que remover**
- Todas as `borderColor` e `bg` coloridas por fonte nos cards e seções
- Badges "oficial" / "db" / "free" nas seções
- Kind legend na sidebar
- Dots coloridos (manter no máximo um ponto neutro)
- `titleRomaji` exibido separado — só no hover tooltip se quiser, ou remover
- `SlidersHorizontal` import não utilizado

**Fonts**
- Manter Rajdhani apenas para o logo/nome do app
- Todo o resto: DM Sans
- JetBrains Mono apenas para scores e contadores numéricos

## Arquivos a modificar
- `src/app/App.tsx` — reescrever a camada de estilo (manter lógica de mock/search intacta)
- `src/styles/theme.css` — ajustar tokens: background mais escuro, card mais sutil, remover cores excessivas

## Verificação
- Pesquisar "demon slayer" e ver resultados em grid e lista sem ruído visual
- Trocar entre "Todos" e uma fonte individual na sidebar
- Ativar/desativar fontes e confirmar comportamento
