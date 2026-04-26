import { IdleUpWidgetState} from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";

class RadioButton extends Widget {
    private _options: { circle: any, dot: any, label: any }[] = [];
    private _labels: string[];
    private _selectedIndex: number = -1;
    private _fontSize: number = 14;
    private defaultSize: number = 16;
    private spacing: number = 30;
    private colorIdle = "#85B7EB";
    private colorSelected = "#378ADD";
    private colorBorder = "#000000";
    private colorHover = "#B5D4F4";

    constructor(parent: Window, numButtons: number) {
        super(parent);
        // set defaults
        // minimum of 2
        let count = Math.max(2, numButtons);
        // Fallback default label for each option 
        this._labels = Array(count).fill("").map((_, i) => `Option ${i + 1}`);
        this.role = RoleType.group;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
    }

    // No need to set fontSize nor positionText methods since there is there isn't a label inside checkbox

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        this._labels.forEach((labelText, i) => {
            let yOffset = i * this.spacing;

            // Border
            let circle = this._group.circle(this.defaultSize);
            circle.fill(this.colorIdle);
            circle.stroke({ color: this.colorBorder, width: 1 });
            circle.move(0, yOffset);

            // Selection 
            let dot = this._group.circle(this.defaultSize / 2);
            dot.fill("white");
            dot.move(this.defaultSize / 4, yOffset + this.defaultSize / 4);
            dot.opacity(0);

            // Right label
            let label = this._group.text(labelText);
            label.font({ size: this._fontSize, family: 'times-new-roman' });
            label.x(this.defaultSize + 8);
            label.y(yOffset - 2);

            // Add a transparent rect on top of text to 
            // prevent selection cursor and to handle mouse events
            let eventrect = this._group.rect(200, this.defaultSize).opacity(0);
            eventrect.move(0, yOffset);

            // Click per option
            eventrect.mouseup(() => {
                this.selectOption(i);
            });

            // Hover
            eventrect.mouseover(() => {
                if (this._selectedIndex !== i) {
                    circle.fill(this.colorHover);
                }
            });

            // Out
            eventrect.mouseout(() => {
                if (this._selectedIndex !== i) {
                    circle.fill(this.colorIdle);
                }
            });

            this._options.push({ circle, dot, label });
        });
    }

    private selectOption(index: number): void {
        // Unselect previous
        if (this._selectedIndex >= 0) {
            this._options[this._selectedIndex].circle.fill(this.colorIdle);
            this._options[this._selectedIndex].dot.opacity(0);
        }

        // Select new
        this._selectedIndex = index;
        this._options[index].circle.fill(this.colorSelected);
        this._options[index].dot.opacity(1);
        this.raise(new EventArgs(this, null, index));
    }

    setLabel(index: number, text: string): void {
        if (index >= 0 && index < this._labels.length) {
            this._labels[index] = text;
            this._options[index].label.text(text);
        }
    }
    
    getLabel(index: number): string {
        return this._labels[index];
    }
    // Get current index
    get selectedIndex(): number {
        return this._selectedIndex;
    }

    onSelectionChanged(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    // There is more than 1 interactive element, so the interactions/states are done in the render
    idleupState(): void { }
    idledownState(): void { }
    pressedState(): void { }
    pressReleaseState(): void { }
    hoverState(): void { }
    hoverPressedState(): void { }
    pressedoutState(): void { }
    moveState(): void { }
    keyupState(keyEvent?: KeyboardEvent): void { }
}

export { RadioButton };