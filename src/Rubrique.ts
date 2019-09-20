export class Rubrique {
    parent: Rubrique;
    private subRubriques: Rubrique[];
    constructor(private level: string, private name: string, private picture?: string, private comment?: string) {
        this.parent = this;
        this.subRubriques = [];
    }
    public levelAsNumber(): number {
        return Number(this.level);
    }
    public addSubRubrique(rub: Rubrique): void {
        rub.parent = this;
        this.subRubriques.push(rub);
    }
    public hasChildren() {
        return this.subRubriques.length > 0;
    }
    public SubRubriques(): Rubrique[] {
        return this.subRubriques;
    }
    public hasParent(): boolean {
        if (this.parent) {
            return this.parent !== this;
        }
        else {
            return this.needsParent();
        }
    }
    public needsParent(): boolean {
        return this.level !== "01" && this.level !== "77";
    }
    public Parent(): Rubrique {
        return (this.parent) ? this.parent : this;
    }
    public Name(): string {
        return this.name;
    }
    public Picture(): string {
        return (this.picture) ? this.picture : "(zone groupe)";
    }
    public Level(): string {
        return this.level;
    }
    public tooltip(): string {
        return `level: ${this.Level()} picture: ${this.Picture()}`;
    }
    public description(): string {
        return `${this.Picture()}`;
    }
}
