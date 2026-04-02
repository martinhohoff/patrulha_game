# Patrulha Game (Paw Patrol Game)

[English](#english) | [Português](#portugues)

## Portugues

Jogo educativo em HTML, CSS e JavaScript para treinar reconhecimento de letras com uma interface inspirada em personagens infantis.

## O que o projeto faz

- Permite escolher um personagem usando as teclas `1` a `6` ou clicando nos botões da tela inicial.
- Mostra uma letra aleatoria para a criança identificar.
- Move o personagem pelo percurso a cada resposta correta, ate chegar ao biscoito final.
- Usa voz do navegador (`speechSynthesis`) para falar instrucoes e letras.
- Toca efeitos sonoros simples com `AudioContext`.
- Exibe um teclado virtual em celulares e dispositivos touch.

## Como executar

Como o projeto e estatico, basta abrir [`index.html`](/Users/martinhohoff/code/martinhohoff/patrulha_game/index.html) no navegador.

Versao publicada: [https://martinhohoff.github.io/patrulha_game/](https://martinhohoff.github.io/patrulha_game/)

Se preferir rodar com um servidor local:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Como jogar

1. Na tela inicial, escolha um personagem com as teclas `1` a `6` ou com um clique/toque.
2. Escute a instrucao e observe a letra exibida no centro da tela.
3. Pressione a letra correta no teclado, ou toque no teclado virtual no celular.
4. Acerte 10 letras para chegar ao final.

## Controles

- `1` a `6`: escolhem o personagem na tela inicial
- `A` a `Z`: respondem a letra durante o jogo
- Qualquer tecla: volta para a tela inicial ao fim da rodada
- Botao `Jogar de novo`: reinicia no fim da rodada em dispositivos touch ou desktop

## Estrutura

- [`index.html`](/Users/martinhohoff/code/martinhohoff/patrulha_game/index.html): estrutura da interface
- [`style.css`](/Users/martinhohoff/code/martinhohoff/patrulha_game/style.css): layout, responsividade e animacoes
- [`script.js`](/Users/martinhohoff/code/martinhohoff/patrulha_game/script.js): logica do jogo, entrada do usuario, voz e audio
- Arquivos `.png`, `.jpg` e `.webp`: personagens, fundo, obstaculos e premio final

## Observacoes

- O audio e a voz dependem dos recursos disponiveis no navegador e no dispositivo.
- O projeto esta em portugues do Brasil (`pt-BR`).
- Nao ha etapa de build nem dependencias externas.

## English

Educational game built with HTML, CSS, and JavaScript to help children practice letter recognition with a kid-friendly character-based interface.

## What the project does

- Lets the player choose a character using keys `1` to `6` or by clicking the start screen buttons.
- Shows a random letter for the child to identify.
- Moves the character forward after each correct answer until the treat at the end is reached.
- Uses browser speech (`speechSynthesis`) to speak instructions and letters.
- Plays simple sound effects with `AudioContext`.
- Shows an on-screen keyboard on phones and touch devices.

## How to run

Because this is a static project, you can simply open [`index.html`](/Users/martinhohoff/code/martinhohoff/patrulha_game/index.html) in a browser.

Live version: [https://martinhohoff.github.io/patrulha_game/](https://martinhohoff.github.io/patrulha_game/)

If you prefer running a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## How to play

1. On the start screen, choose a character with keys `1` to `6` or with a click/tap.
2. Listen to the instruction and look at the letter shown in the center of the screen.
3. Press the correct letter on the keyboard, or tap it on the on-screen keyboard on mobile.
4. Get 10 letters right to reach the end.

## Controls

- `1` to `6`: choose a character on the start screen
- `A` to `Z`: answer the current letter during gameplay
- Any key: return to the start screen after finishing a round
- `Jogar de novo` button: restart after finishing a round on touch devices or desktop

## Structure

- [`index.html`](/Users/martinhohoff/code/martinhohoff/patrulha_game/index.html): UI structure
- [`style.css`](/Users/martinhohoff/code/martinhohoff/patrulha_game/style.css): layout, responsiveness, and animations
- [`script.js`](/Users/martinhohoff/code/martinhohoff/patrulha_game/script.js): game logic, input handling, speech, and audio
- `.png`, `.jpg`, and `.webp` files: characters, background, obstacles, and final reward assets

## Notes

- Audio and speech depend on the browser and device capabilities.
- The in-game language is Brazilian Portuguese (`pt-BR`).
- There is no build step and no external dependencies.
