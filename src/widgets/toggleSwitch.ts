import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class ToggleSwitch extends Widget {
    private _track: Rect;
    private _label: Text;
    private _thumb: any;
    private _labelInput: string = "Toggle";
    private _isOn: boolean = false;
    private _trackWidth: number = 40;
    private _trackHeight: number = 20;
    private _thumbSize: number = 14;
    private colorOff = "#D3D1C7";
    private colorOn = "#378ADD";
    private colorThumb = "#FFFFFF";
    private colorBorder = "#000000";

    constructor(parent: Window) {
        super(parent);
        this.role = RoleType.button;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.idleupState();
        this.selectable = false;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        // Track
        this._track = this._group.rect(this._trackWidth, this._trackHeight);
        this._track.radius(this._trackHeight / 2);
        this._track.fill(this.colorOff);
        this._track.stroke({ color: this.colorBorder, width: 1 });
        this._track.move(0, 0);

        // Thumb
        this._thumb = this._group.circle(this._thumbSize);
        this._thumb.fill(this.colorThumb);
        this._thumb.move(3, 3);

        // Right label
        this._label = this._group.text(this._labelInput);
        this._label.font({ size: 14, family: 'times-new-roman' });
        this._label.x(this._trackWidth + 10);
        this._label.y(2);

        // Hit area
        let eventrect = this._group.rect(this._trackWidth, this._trackHeight)
            .opacity(0).move(0, 0);
        this.registerEvent(eventrect);
    }

    private updateThumb(): void {
        if (this._isOn) {
            let xPos = this._trackWidth - this._thumbSize - 3;
            this._thumb.move(xPos, 3);
            this._track.fill(this.colorOn);
        } else {
            this._thumb.move(3, 3);
            this._track.fill(this.colorOff);
        }
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this._isOn = !this._isOn;
            this.updateThumb();
            this.raise(new EventArgs(this, this._isOn ? "on" : "off", this._isOn));
        }
    }

    onToggle(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    get label(): string {
        return this._labelInput;
    }

    set label(text: string) {
        this._labelInput = text;
        this._label.text(text);
    }

    get isOn(): boolean {
        return this._isOn;
    }
    
    override move(x: number, y: number): void {
        this._group.transform({ translateX: x, translateY: y });
    }

    idleupState(): void {
        this._track.stroke({ color: this.colorBorder, width: 1 });
        this._track.opacity(1);
    }

    hoverState(): void {
        this._track.stroke({ color: "#185FA5", width: 2 });
        this._track.opacity(0.85);
    }

    pressedState(): void {
        this._track.stroke({ color: "#185FA5", width: 2 });
        this._track.opacity(0.7);
    }

    hoverPressedState(): void {
        this._track.stroke({ color: "#185FA5", width: 2 });
    }

    pressedoutState(): void {
        this._track.stroke({ color: this.colorBorder, width: 1 });
        this._track.opacity(1);
    }

    idledownState(): void { }
    moveState(): void { }
    keyupState(keyEvent?: KeyboardEvent): void { }
}


export { ToggleSwitch };