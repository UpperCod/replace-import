# @uppercod/replace-import

Allows replacing imports and exports in JS code, this package uses magic-string and es-module-lexer.

## Install

```
npm install @atomico/replace-import
```

## Usage

```js
import replaceImprot from "@uppercod/replace-import";

const  { code, map, toString } =  await replaceImport({
    code: `
    import style from  "./style.css";
    `,
    /**
     * @param {string} file
     * @returns {boolean}
     */
    filter: (file)=>file.endsWith(".css"),
    /**
     * @param {Token} token
     * @returns {Promise<Token>|Token}
     */
    replace(token){
        token.toString =( )=>`const ${token.scope} = new URL("$`{token.src}`",import.meta.url);`
        return token;
    }
});
```
