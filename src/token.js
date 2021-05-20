export class Token {
    /**
     * @param {string} code
     * @param {import("es-module-lexer").ImportSpecifier} part
     */
    constructor(code, part) {
        this.src = code.slice(part.s, part.e);
        this.dinamic = part.d > -1;
        this.mark = this.dinamic ? [part.ss, part.e + 1] : [part.ss, part.se];
        this.input = code.slice(...this.mark);
        this.parse(this.input || this.src);
    }

    /**
     *  @param {string} input
     */
    parse(input) {
        try {
            if (this.dinamic) {
                const [, quote] =
                    input
                        .replace(/\/\/(.*)/gm, "")
                        .replace(/\s/g, "")
                        .replace(/\/\*+([^*]*)\*+\//g, "")
                        .match(/^import\(('|"|`)/) || [];
                this.quote = quote;
                this.src =
                    this.src[0] == this.quote
                        ? this.src.slice(1, this.src.length - 1)
                        : this.src;
            } else {
                const [, type, scope = "", quote = ""] = input.match(
                    /(\w+)\s*(?:(.+)\s*from){0,1}\s*("|'|`)/s
                );
                this.scope = scope.trim();
                this.quote = quote;
                this.type = type == "import" || type == "export" ? type : "";
            }
        } catch (e) {
            this.toString = () => input;
        }
    }
    toString() {
        let { type, scope, src, quote } = this;
        quote = quote || "";
        if (type) {
            return (
                type +
                " " +
                (scope ? scope + " from " : "") +
                quote +
                src +
                quote
            );
        } else {
            return `import(${quote + src + quote})`;
        }
    }
}
