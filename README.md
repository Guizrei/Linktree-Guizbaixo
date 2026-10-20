# guizbaixo — links

Site estilo linktree com LivePix, Discord e YouTube. HTML, CSS e JS puros, sem build.

## Estrutura

```
index.html
css/style.css
js/main.js
assets/bg.jpg      (fundo em P&B desfocado)
assets/grain.svg   (grão de filme)
.nojekyll
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `guizbaixo.github.io` ou `links`).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.
5. Salve e aguarde 1–2 minutos. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Segurança

- A política de segurança (CSP) está no `<head>` do `index.html`: só carrega scripts e estilos do próprio site e as fontes do Google.
- Os links ficam travados em `js/main.js` (objeto `LINKS`). Para trocar um link, edite lá **e** no `index.html`.
- No GitHub, ative proteção da branch `main` e autenticação em dois fatores para ninguém alterar o código sem você.
