// importing local code, code we have written
import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
// importing code from SVG.js library
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string = "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 80;
    private defaultHeight: number = 30;
    private Idle = "#85B7EB";
    private Hover = "#3d82c8";
    private Pressed = "#378ADD";
    private blueBorder = "#185FA5";
    private blueText = "#042C53";

    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
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

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    private positionText() {
        let box: Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height() / 2)) - (box.height / 2));
        this._text.x(+this._rect.x() + 4);
        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.radius(8);
        this._rect.stroke("black");
        this._text = this._group.text(this._input);
        // Set the outer svg element 
        this.outerSvg = this._group;
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        let eventrect = this._group.rect(this.width, this.height).opacity(0).attr('id', 0);

        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(eventrect);
    }

    override update(): void {
        if (this._text != null)
            this._text.font('size', this._fontSize);
        this._text.text(this._input);
        this.positionText();

        if (this._rect != null)
            this._rect.fill(this.backcolor);

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState)
            this.raise(new EventArgs(this));
    }

    onClick(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }


    //widgets

    private applyState(fill: string, strokeColor: string, strokeWidth: number, textColor: string): void {
        this._rect.fill(fill);
        this._rect.stroke({ color: strokeColor, width: strokeWidth });
        this._text.fill(textColor);
    }

    idleupState(): void {
        this.applyState(this.Idle, "black", 1.5, "black");
    }
    idledownState(): void{
        // Mouse down do nothing
    }
    pressedState(): void {
        this.applyState(this.Pressed, this.blueBorder, 1.5, "white");
    }
    hoverState(): void {
        this.applyState(this.Hover, "black", 2.5, this.blueText);
    }
    hoverPressedState(): void {
        this.applyState(this.Hover, "black", 1.5, this.blueText);
    }
    pressedoutState(): void {
        this.applyState(this.Idle, "black", 1.5, "black");
    }
    // Buttons do not drag
    moveState(): void {
        throw new Error("Method not implemented.");
    }
    // buttons do not support keyboard input
    keyupState(keyEvent?: KeyboardEvent): void {
        // throw new Error("Method not implemented.");
    }
    get label(): string {
        return this._input;
    }

    set label(text: string) {
        this._input = text;
        this.update();
    }

    get btnSize(): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }

    set btnSize(dimensions: { width: number, height: number }) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this._rect.size(this.width, this.height);
        this.update();
    }
}

export { Button }