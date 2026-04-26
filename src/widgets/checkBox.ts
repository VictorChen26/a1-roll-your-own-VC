import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class CheckBox extends Widget {
    private _rect: Rect;
    private _checkmark: Text;
    private _label: Text;
    private _labelInput: string;
    private _checked: boolean;
    private _fontSize: number;
    private _checkMarkSize: number;
    private defaultSize: number = 25;
    private defaultFontSize: number = 16;
    private defaultCheckMarkSize: number = 30
    private colorIdle = "#85B7EB";
    private colorChecked = "#378ADD";
    private colorBorder = "#000000";
    private colorBorderStyle = "#185FA5"

    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.height = this.defaultSize;
        this.width = this.defaultSize;
        this._checked = false;
        this._labelInput = "Checkbox";
        this._fontSize = this.defaultFontSize;
        this._checkMarkSize = this.defaultCheckMarkSize;
        // set Aria role
        this.role = RoleType.button;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        this.idleupState();
        // prevent text selection
        this.selectable = false;
    }

    // No need to set fontSize nor positionText methods since there is there isn't a label inside checkbox

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._rect = this._group.rect(this.defaultSize, this.defaultSize);
        this._rect.radius(5);
        this._rect.fill(this.colorIdle);
        this._rect.stroke({ color: this.colorBorder, width: 1.5 });

        // checkmark, hidden by default
        this._checkmark = this._group.text("✓");
        this._checkmark.font({ size: this._checkMarkSize, weight: '600' });
        this._checkmark.x(4);
        this._checkmark.y(-10);
        this._checkmark.fill("green");
        this._checkmark.opacity(0);

        // label to the right
        this._label = this._group.text(this._labelInput);
        this._label.font({ size: this._fontSize, family: 'times-new-roman'});
        this._label.x(this.defaultSize + 6);
        this._label.y(6);


        // Set the outer svg element 
        this.outerSvg = this._group;
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        let eventrect = this._group.rect(this.defaultSize, this.defaultSize).opacity(0).attr('id', 0);
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(eventrect);
    }

    // No need for update since we are not modifing the text inside checkbox

    // toggles check/uncheck on click
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this._checked = !this._checked;
            this.updateCheckmark();
            this.raise(new EventArgs(this));
        }
    }

    // on/off
    private updateCheckmark(): void {
        if (this._checked) {
            this._rect.fill(this.colorChecked);
            this._checkmark.opacity(1);
        } else {
            this._rect.fill(this.colorIdle);
            this._checkmark.opacity(0);
        }
    }

    onCheckedChanged(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    get label(): string {
        return this._labelInput;
    }

    set label(text: string) {
        this._labelInput = text;
        this._label.text(text);
    }

    get checked(): boolean {
        return this._checked;
    }

    private applyState(color: string, width: number, opacity: number = 1.0): void {
        this._rect.stroke({ color: color, width: width });
        this._rect.opacity(opacity);
    }

    idleupState(): void {
        this.applyState(this.colorBorder, 1.5);
    }

    idledownState(): void { }

    pressedState(): void {
        this.applyState(this.colorBorderStyle, 2);
    }

    hoverState(): void {
        this.applyState(this.colorBorderStyle, 2, 0.85);
    }

    hoverPressedState(): void {
        this.applyState(this.colorBorderStyle, 2);
    }

    pressedoutState(): void {
        this.applyState(this.colorBorder, 1.5);
    }

    moveState(): void { }

    keyupState(keyEvent?: KeyboardEvent): void {
        // buttons don't support keyboard input
    }
}

export { CheckBox };