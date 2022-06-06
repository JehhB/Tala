import { Constellation, Note, toValidTitle } from "../src/utils";

export const generate_notes_from_constellation = function (
  constellation: Constellation
): Note[] {
  const generateContent = (title: string, description: string) => `# ${title}

${description}

## H2
### H3
#### H4
##### H5
###### H6

## Emphasis

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

## List

1. First ordered list item
2. Another item
   * Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
   Note that this line is separate, but within the same paragraph.⋅⋅
   (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)
1. a
   1. b
      1. c
* a
  * b
    * c

## Links
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

## Images
![alt text](https://via.placeholder.com/150)

## Code

Inline \`code\` has \`back-ticks around\` it.

\`\`\`javascript
var s = "JavaScript syntax highlighting";
alert(s);
\`\`\`

## Tables

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## Blockqoutes

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

## Horizontal rule

Three or more...

---

## Footnote

Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].  

You can also use words, to fit your writing style more closely[^note].

[^1]: My reference.
[^2]: Every new line should be prefixed with 2 spaces.  
  This allows you to have a footnote with multiple lines.
[^note]:
    Named footnotes will still render with numbers instead of the text but allow easier identification and linking.  
    This footnote also has been made with a different syntax using 4 spaces for new lines.
`;

  return constellation.notes.map(({ id, title, description, category_id }) => ({
    ...{ id, title, category_id },
    filename: toValidTitle(title),
    category_id: category_id,
    content: generateContent(title, description),
  }));
};
