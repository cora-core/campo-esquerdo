# Calendário — Como adicionar eventos

Todos os eventos ficam no array `calendarEvents` em `SimpleCalendar.tsx`.

---

## Campos do evento

| Campo | Obrigatório | Onde aparece | Descrição |
|-------|:-----------:|--------------|-----------|
| `day` | ✅ | — | Dia do mês (1–31) |
| `month` | ✅ | — | Mês, **0-indexed** (0 = Janeiro, 11 = Dezembro) |
| `year` | ✅ | — | Ano (ex: 2026) |
| `title` | ✅ | Célula do calendário + cabeçalho do detalhe | Nome do evento, em caixa alta (ex: `"SEMINÁRIOS"`) |
| `description` | — | Célula do calendário (desktop) | Texto curto mostrado dentro da célula preta no calendário |
| `eventSubtitle` | — | Cabeçalho do detalhe (abaixo do título) | Subtítulo independente do `description` — pode ser diferente |
| `fullDescription` | — | Corpo do detalhe (coluna esquerda) | Texto longo do evento |
| `local` | — | Rodapé do detalhe | Local do evento |
| `hora` | — | Rodapé do detalhe | Horário do evento |
| `image` | — | Coluna direita do detalhe | Caminho da imagem (ver specs abaixo) |
| `link` | — | Botão abaixo da imagem | URL do link externo |
| `linkText` | — | Botão abaixo da imagem | Texto do botão (padrão: `"TEXTO DO LINK"`) |

---

## Exemplo completo

```ts
{
  day: 2,
  month: 2,           // Março (0-indexed!)
  year: 2026,
  title: "SEMINÁRIOS",
  description: "14:00; Mari Herzer, J-P Caron",       // texto na célula do calendário
  eventSubtitle: "Com Mari Herzer e J-P Caron",       // subtítulo na página do evento
  fullDescription: "Lorem ipsum dolor sit amet...",    // corpo de texto
  local: "SESC Pompeia",
  hora: "14:00",
  image: "/assets/seminarios-poster.png",
  link: "https://example.com/inscricao",
  linkText: "INSCREVA-SE",
}
```

## Exemplo mínimo

```ts
{
  day: 15,
  month: 5,    // Junho
  year: 2026,
  title: "NOVO EVENTO",
  description: "em breve",
}
```

---

## Imagens

### Onde colocar
Coloque os arquivos em `/public/assets/` e referencie como `/assets/nome-do-arquivo.png`.

### Tamanho recomendado
| Aspecto | Valor |
|---------|-------|
| **Formato** | PNG ou JPG |
| **Proporção ideal** | **3:4** (retrato/poster) ou **1:1** (quadrado) |
| **Resolução recomendada** | **600×800 px** (3:4) ou **600×600 px** (1:1) |
| **Resolução máxima** | 1200×1600 px (desnecessário ir além disso) |
| **Tamanho de arquivo** | Manter abaixo de **200 KB** (otimizar com TinyPNG etc.) |

A imagem é exibida com `object-contain` — ela se ajusta ao espaço disponível sem cortar. Imagens muito largas (paisagem) vão ficar pequenas, então prefira formato retrato ou quadrado.

### Sem imagem?
Basta não incluir o campo `image`. O espaço fica vazio e o botão de link ainda aparece.

---

## ⚠️ Atenção ao `month`

O campo `month` usa **indexação a partir de zero** (padrão JavaScript):

| Valor | Mês |
|:-----:|-----|
| 0 | Janeiro |
| 1 | Fevereiro |
| 2 | Março |
| 3 | Abril |
| 4 | Maio |
| 5 | Junho |
| 6 | Julho |
| 7 | Agosto |
| 8 | Setembro |
| 9 | Outubro |
| 10 | Novembro |
| 11 | Dezembro |
