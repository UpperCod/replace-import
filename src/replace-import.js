import { init, parse } from "es-module-lexer";
import MagicString from "magic-string";
import { Token } from "./token.js";

/**
 *
 * @param {Object} options
 * @param {string} options.code
 * @param {(src:string)=>boolean} options.filter
 * @param {(token:Token)=>Promise<Token|null>|Token|null} [options.replace]
 * @returns
 */
export async function replaceImport({ code, filter, replace }) {
    await init;

    const [imports] = parse(code);

    const tokens = await Promise.all(
        imports.map((part) => {
            const token = new Token(code, part);
            if (!filter || filter(token.src)) return replace(token);
        })
    );

    const mg = new MagicString(code);

    tokens
        .filter((token) => token)
        .filter((token) => token.input != token.toString())
        .forEach((token) => {
            const [start, end] = token.mark;
            mg.overwrite(start, end, token.toString());
        });

    const map = mg.generateMap();
    const ouput = mg.toString();

    return {
        code: ouput,
        map,
        toString: () => code + "\n//# sourceMappingURL=" + map.toUrl(),
    };
}
