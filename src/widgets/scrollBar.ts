import { IdleUpWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, SVG } from "../core/ui";

class ScrollBar extends Widget {
    private _track: Rect;
    private _thumb: Rect;
    private _upButton: Rect;
    private _downButton: Rect;
    private _isDragging: boolean = false;
    private _dragStartY: number = 0;
    private _dragStartThumbY: number = 0;
    private _thumbRect: any;
    private _scrollInterval: any = null;
    private _trackHeight: number = 200;
    private _buttonSize: number = 20;
    private _thumbHeight: number = 40;
    private _thumbY: number = 0;
    private _barWidth: number = 20;
    private colorTrack = "#D3D1C7";
    private colorThumb = "#85B7EB";
    private colorThumbHover = "#B5D4F4";
    private colorButton = "#85B7EB";
    private colorButtonHover = "#B5D4F4";
    private colorButtonPressed = "#378ADD";
    private colorBorder = "#000000";

    private get trackBottom(): number {
        return this._trackHeight - this._thumbHeight;
    }

    constructor(parent: Window) {
        super(parent);
        this.role = RoleType.scrollbar;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        // Up button
        this._upButton = this._group.rect(this._barWidth, this._buttonSize);
        this._upButton.fill(this.colorButton);
        this._upButton.stroke({ color: this.colorBorder, width: 1 });
        this._upButton.move(0, 0);

        // Up arrow
        let upArrow = this._group.text("▲");
        upArrow.font({ size: 20, family: 'times-new-roman' });
        upArrow.x(0);
        upArrow.y(-1);

        // Up button hit area above label
        let upRect = this._group.rect(this._barWidth, this._buttonSize)
            .opacity(0).move(0, 0);
        upRect.mousedown(() => {
            this._upButton.fill(this.colorButtonPressed);
            this.moveThumb(-10);
            this._scrollInterval = setInterval(() => {
                this.moveThumb(-10);
            }, 100);
            const stopUp = () => {
                this._upButton.fill(this.colorButton);
                this.stopScroll();
                window.removeEventListener('mouseup', stopUp);
            };
            window.addEventListener('mouseup', stopUp);
        });
        upRect.mouseover(() => this._upButton.fill(this.colorButtonHover)); // Hovering
        upRect.mouseout(() => this._upButton.fill(this.colorButton)); // Mouse out/Restore


        // Down button
        this._downButton = this._group.rect(this._barWidth, this._buttonSize);
        this._downButton.fill(this.colorButton);
        this._downButton.stroke({ color: this.colorBorder, width: 1 });
        this._downButton.move(0, this._buttonSize + this._trackHeight + 0.5);

        // Down arrow
        let downArrow = this._group.text("▼");
        downArrow.font({ size: 20, family: 'times-new-roman' });
        downArrow.x(0);
        downArrow.y(this._buttonSize + this._trackHeight - 2);

        // Down button hit area above label
        let downRect = this._group.rect(this._barWidth, this._buttonSize)
            .opacity(0).move(0, this._buttonSize + this._trackHeight);
        downRect.mousedown(() => {
            // Movement
            this._downButton.fill(this.colorButtonPressed);
            this.moveThumb(10);
            this._scrollInterval = setInterval(() => {
                this.moveThumb(10);
            }, 100);
            // stops mouse from falling continuosly down after hitting the down button
            const stopDown = () => {
                this._downButton.fill(this.colorButton);
                this.stopScroll();
                SVG(window).off('mouseup', stopDown);
            };
            SVG(window).on('mouseup', stopDown);
        });
        downRect.mouseover(() => this._downButton.fill(this.colorButtonHover));
        downRect.mouseout(() => this._downButton.fill(this.colorButton));

        // Track
        this._track = this._group.rect(this._barWidth, this._trackHeight);
        this._track.fill(this.colorTrack);
        this._track.stroke({ color: this.colorBorder, width: 1 });
        this._track.move(0, this._buttonSize);

        // Thumb
        this._thumb = this._group.rect(this._barWidth, this._thumbHeight);
        this._thumb.fill(this.colorThumb);
        this._thumb.stroke({ color: this.colorBorder, width: 1 });
        this._thumb.move(0, this._buttonSize);

        // Track hit area 
        let trackRect = this._group.rect(this._barWidth, this._trackHeight)
            .opacity(0).move(0, this._buttonSize);
        // Click and jump action
        trackRect.mousedown((event: any) => {
            let groupY = this.getGroupY();
            let clickY = event.clientY - groupY - this._buttonSize;
            let thumbTop = this._thumbY;
            let thumbBottom = this._thumbY + this._thumbHeight;
            if (clickY >= thumbTop && clickY <= thumbBottom) return;
            let newY = Math.max(0, Math.min(
                clickY - this._thumbHeight / 2,
                this._trackHeight - this._thumbHeight
            ));
            this._thumbY = newY;
            this._thumb.move(0, this._buttonSize + this._thumbY);
            this._thumbRect.move(0, this._buttonSize + this._thumbY);
            this.raise(new EventArgs(this, null, this.scrollPercent));
        });

        // Thumb hit area
        this._thumbRect = this._group.rect(this._barWidth, this._thumbHeight)
            .opacity(0).move(0, this._buttonSize);
        // Dragging instead of click and jump
        this._thumbRect.mousedown((event: any) => {
            this._isDragging = true;
            this._dragStartY = event.clientY;
            this._dragStartThumbY = this._thumbY;
            event.stopPropagation();
            // Mouse drag
            const onMouseMove = (moveEvent: MouseEvent) => {
                if (!this._isDragging) return;
                const delta = moveEvent.clientY - this._dragStartY;
                const newY = Math.max(0, Math.min(
                    this._dragStartThumbY + delta,
                    this._trackHeight - this._thumbHeight
                ));
                const direction = newY > this._thumbY ? 'down' : newY < this._thumbY ? 'up' : null;
                this._thumbY = newY;

                this._thumb.move(0, this._buttonSize + this._thumbY);
                this._thumbRect.move(0, this._buttonSize + this._thumbY);
                if (direction !== null) {
                    this.raise(new EventArgs(this, direction, this.scrollPercent));
                }
            };
            // Mouse Up 
            const onMouseUp = () => {
                this._isDragging = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            // Window events
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
        this._thumbRect.mouseover(() => this._thumb.fill(this.colorThumbHover));
        this._thumbRect.mouseout(() => {
            if (!this._isDragging) this._thumb.fill(this.colorThumb);
        });
    }

    private getGroupY(): number {
        return (this._group as any).transform().translateY || 0;
    }

    private stopScroll(): void {
        if (this._scrollInterval != null) {
            clearInterval(this._scrollInterval);
            this._scrollInterval = null;
        }
    }

    private moveThumb(delta: number): void {
        const direction = delta > 0 ? 'down' : 'up';
        this._thumbY = Math.max(0, Math.min(
            this._thumbY + delta,
            this._trackHeight - this._thumbHeight
        ));
        this._thumb.move(0, this._buttonSize + this._thumbY);
        this._thumbRect.move(0, this._buttonSize + this._thumbY);
        this.raise(new EventArgs(this, direction, this.scrollPercent));
    }


    get scrollPercent(): number {
        return this._thumbY / this.trackBottom;
    }


    get scrollHeight(): number {
        return this._trackHeight;
    }

    set scrollHeight(height: number) {
        this._trackHeight = height - (this._buttonSize * 2);
        const transform = (this._group as any).transform();
        const x = transform.translateX || 0;
        const y = transform.translateY || 0;
        this._group.clear();
        this.render();
        this.move(x, y);
        this.raise(new EventArgs(this, null, this.scrollPercent));
    }

    get thumbPosition(): number {
        return this._thumbY;
    }

    onScroll(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    // Need to override move, super.move uses outerSVG.move which doesnt work w svg.groups
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

export { ScrollBar };