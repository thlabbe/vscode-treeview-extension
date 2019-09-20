import * as vscode from 'vscode';
import { CopyItem } from "./CopyItem";
import { Rubrique } from "./Rubrique";
export class CopyBook {
    //rubriques: Rubrique[];
    items: CopyItem[];
    constructor(private text: string[]) {
        let rubs = this.parse(text);
        // finalement les rubriques sont les niveaux '01' du Copybook 
        // par construction (les sous rubriques sont 'portées' par les niveaux '01')
        let rubriques = rubs.filter(rub => rub.levelAsNumber() === 1);
        // TODO #2 : determiner la position et la longueur de chaque rubrique
        this.items = [];
        // TODO #3 : assembler this.Rubriques en CopyItem
        for (let index = 0; index < rubriques.length; index++) {
            const element = rubriques[index];
            const collapsable = element.hasChildren() ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
            this.items.push(new CopyItem(element.Name(), element, collapsable));
        }
    }
    private parse(text: string[]): Rubrique[] {
        let rubriques: Rubrique[] = [];
        function removeRedundantSpaces(input: string): string {
            input = input.replace(/\s\s+/g, " ");
            return input;
        }
        function hasEndPeriod(input: string): boolean {
            return new RegExp("^.*\\.\s*").test(input);
        }
        function isCommentLine(input: string): boolean {
            return new RegExp("^.{6}\\*.*").test(input);
        }
        let comment: string[] = [];
        let currentLine: string = '';
        let tokenizedLines = [];
        for (let index = 0; index < text.length; index++) {
            const ligne = text[index];
            if (ligne.length > 7) {
                if (isCommentLine(ligne)) {
                    // c'est un commentaire on empile les commentaires
                    comment.push(ligne);
                    currentLine = '';
                }
                else {
                    // ce n'est pas un commentaire 
                    currentLine += " " + ligne.substring(7);
                    if (hasEndPeriod(ligne)) {
                        currentLine = removeRedundantSpaces(currentLine);
                        let currentTokenized = { tokens: currentLine.split(' ').filter(elt => elt.length > 0), comment: comment.join(' ') };
                        tokenizedLines.push(currentTokenized);
                        currentLine = '';
                        comment = [];
                    }
                }
            }
        }
        for (let index = 0; index < tokenizedLines.length; index++) {
            const element = tokenizedLines[index];
            const tokens = element.tokens;
            const comment = element.comment;
            let level: string = tokens[0];
            let name: string = tokens[1];
            let pic: string = '';
            if (hasEndPeriod(name)) {
                name = name.substring(0, name.length - 1);
            }
            if (tokens.length > 2) {
                if (!(tokens[2].startsWith('PIC') || (tokens[2] === 'REDEFINES'))) {
                    throw new Error(`Parse error ${element}`);
                }
                for (let t = 3; t < tokens.length; t++) {
                    pic = pic.concat(tokens[t]).concat(' ');
                }
            }
            rubriques.push(new Rubrique(level, name, pic, comment));
        }
        let curRub = rubriques[0];
        for (let index = 1; index < rubriques.length; index++) {
            let nthRub = rubriques[index];
            if (nthRub.levelAsNumber() === curRub.levelAsNumber()) {
                /* level == prec level -> on ajoute nth au parent de prec */
                curRub.parent.addSubRubrique(nthRub);
                curRub = nthRub;
            }
            else {
                if (nthRub.levelAsNumber() > curRub.levelAsNumber()) {
                    /* level > prec level -> prec est parent de nth */
                    curRub.addSubRubrique(nthRub);
                    curRub = nthRub;
                }
                else {
                    while (nthRub.levelAsNumber() <= curRub.levelAsNumber() && curRub.hasParent()) {
                        if (curRub === curRub.parent) {
                            throw new Error(" infinite loop !");
                        }
                        curRub = curRub.parent;
                    }
                    if (nthRub.needsParent()) {
                        curRub.addSubRubrique(nthRub);
                    }
                    curRub = nthRub;
                }
            }
        }
        return rubriques;
    }
}
