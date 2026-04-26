import { IdleUpWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class ProgressBar extends Widget {
    private _track: Rect;
    private _fill: Rect;
    private _label: Text;
    private _progress: number = 0;
    private _incrementRate: number = 10;
    private _barWidth: number = 200;
    private _barHeight: number = 20;
    private colorTrack = "#D3D1C7";
    private colorFill = "#378ADD";
    private colorBorder = "#000000";
    private colorText = "#000000";

    constructor(parent: Window) {
        super(parent);
        this.role = RoleType.none;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        // Track
        this._track = this._group.rect(this._barWidth, this._barHeight);
        this._track.fill(this.colorTrack);
        this._track.stroke({ color: this.colorBorder, width: 1 });
        this._track.radius(4);
        this._track.move(0, 0);

        // Fill 
        this._fill = this._group.rect(0, this._barHeight);
        this._fill.fill(this.colorFill);
        this._fill.radius(4);
        this._fill.move(0, 0);

        // Percent Label
        this._label = this._group.text("0%");
        this._label.font({ size: 18, family: 'times-new-roman', weight: '500' });
        this._label.fill(this.colorText);
        this._label.attr('text-anchor', 'middle');
        this._label.x(this._barWidth / 2);
        this._label.y(-22);
    }

    // Progress Label
    private updateFill(): void {
        let fillWidth = (this._progress / 100) * this._barWidth;
        this._fill.width(fillWidth);
        this._label.text(`Progress: ${this._progress}%`);

        if (this._progress === 0) {
            this._label.text(`Empty: ${this._progress}%`);
            this.raise(new EventArgs(this, "Empty", this._progress));
        } else if (this._progress === 100) {
            this._label.text(`Completed: ${this._progress}%`);
            this.raise(new EventArgs(this, "Complete", this._progress));
        } else {
            this.raise(new EventArgs(this, "In Progress", this._progress));
        }
    }

    step(): void {
        this._progress = Math.min(100, this._progress + this._incrementRate);
        this.updateFill();
        this.raise(new EventArgs(this, null, this._progress));
    }

    get barWidth(): number {
        return this._barWidth;
    }

    set barWidth(width: number) {
        this._barWidth = width;
        this._track.width(this._barWidth);
        this._label.x(this._barWidth / 2);
        this.updateFill();
    }

    get increment(): number {
        return this._incrementRate;
    }

    set increment(value: number) {
        if (value < 0 || value > 100) {
            console.log("Increment must be between 0 and 100");
            return;
        }
        this._incrementRate = value;
    }

    get progress(): number {
        return this._progress;
    }

    incrementBy(value: number): void {
        if (value < 0 || value > 100) {
            console.log("Value must be between 0 and 100");
            return;
        }
        this._progress = Math.min(100, this._progress + value);
        this.updateFill();
        this.raise(new EventArgs(this, null, this._progress));
    }

    onProgress(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    onStateChanged(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    override move(x: number, y: number): void {
        this._group.transform({ translateX: x, translateY: y });
    }

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

export { ProgressBar };