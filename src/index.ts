import { EventArgs, Window } from "./core/ui"
import { Button } from "./widgets/button"
import { Heading } from "./widgets/heading"
import { CheckBox } from "./widgets/checkBox";
import { RadioButton } from "./widgets/radioButton";
import { ScrollBar } from "./widgets/scrollBar";
import { ProgressBar } from "./widgets/progressBar";
import { ToggleSwitch } from "./widgets/toggleSwitch";

// Window Frame
let w = new Window(window.innerHeight - 10, '100%');

const columnX = 10;
const defaultFontSize = 16;

// Heading
let lbl1 = new Heading(w);
lbl1.text = "Widgets Toolkit";
lbl1.tabindex = 1;
lbl1.fontSize = defaultFontSize;
lbl1.move(columnX, 20);

// Button
let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14;
btn.move(columnX, 50)
btn.label = "Click me";
btn.btnSize = { width: 60, height: 30 };
let lbl2 = new Heading(w);
lbl2.text = "";
lbl2.tabindex = 1;
lbl2.fontSize = 16;
lbl2.move(columnX, 100);
btn.onClick((event) => {
    lbl2.text = "Button has been clicked!"
});

// CheckBox
let cb = new CheckBox(w);;
cb.move(columnX, 110); 
cb.tabindex = 3;
cb.label = "Accept terms of service";
let lbl3 = new Heading(w);
lbl3.fontSize = defaultFontSize;
lbl3.text = "";
lbl3.move(columnX, 170);

cb.onCheckedChanged((event) => {
    let checkbox = event.obj as CheckBox;
    console.log(checkbox.checked ? "Checked!" : "Unchecked!")
    lbl3.text = checkbox.checked ? "Checked!" : "Unchecked";
});

// Radio Box 
let numButtons = 3;
let rb = new RadioButton(w, numButtons); // Default value for numButtons
rb.tabindex = 4;
const rbY = 185;
rb.move(columnX, rbY);
rb.setLabel(0, "Option A");
rb.setLabel(1, "Option B");
rb.setLabel(2, "Option C");
let lbl4 = new Heading(w);
lbl4.text = "";
lbl4.fontSize = defaultFontSize;
const rbLastHeight = rbY + (numButtons * 30) + 15;
lbl4.move(columnX, rbLastHeight);

rb.onSelectionChanged((event) => {
    let selected = event.itemRef as number;
    console.log(`Option ${selected + 1} selected`);
    lbl4.text = `Option ${selected + 1} selected`;
    // lbl4.text = `Option ${rb.getLabel(selected)} selected`; // Option available if the user prefers the set label
});

// Scrollbar
let sb = new ScrollBar(w);
let lbl5 = new Heading(w);
sb.tabindex = 5;
lbl5.text = "";
lbl5.fontSize = defaultFontSize;
const sbY = rbLastHeight + 10;
sb.move(columnX, sbY);
// sb.scrollHeight = 100; // Set the scroll height
// Dynamic label based on the size of scrollHeight
const sbYLabel = sbY + sb.scrollHeight + 70;
lbl5.move(columnX, sbYLabel);
sb.onScroll((event) => {
    let pos = sb.thumbPosition;
    let percent = Math.round(sb.scrollPercent * 100);
    const direction = event.event as string;
    console.log(`Percent: ${percent}% | Direction: ${direction}`);
    lbl5.text = `Percent: ${percent}% | Direction: ${direction}`;
});

// Progress Bar
let pb = new ProgressBar(w);
pb.tabindex = 6;
const pbY = sbYLabel + 30;
pb.move(columnX, pbY)
pb.barWidth = 200; // Set barWidth 
pb.increment = 10;  // Set the increment rate

pb.onProgress((event) => {
    let pct = event.itemRef as number;
    console.log(`Progress incremented: ${pct}%`);
});

pb.onStateChanged((event) => {
    let state = event.event as string;
    let pct = event.itemRef as number;
    console.log(`State changed: ${state} at ${pct}%`);
});

// Extra button to add progress
let pbBtn = new Button(w);
pbBtn.fontSize = 12;
pbBtn.label = "Increment";
pbBtn.btnSize = { width: 60, height: 20 };
pbBtn.move(columnX, sbYLabel + 60);

pbBtn.onClick((event) => {
    pb.step();
});

// Toggle Switch
let ts = new ToggleSwitch(w);
ts.tabindex = 7;
const tsY = pbY + 80;
ts.move(columnX, tsY);
ts.label = "Dark Mode";
let lbl6 = new Heading(w);
lbl6.fontSize = defaultFontSize;
lbl6.text = ""
lbl6.move(columnX, tsY + 50);

ts.onToggle((event) => {
    let t = event.obj as ToggleSwitch;
    console.log(t.isOn ? "On" : "Off");
    lbl6.text = t.isOn ? "On" : "Off";
});