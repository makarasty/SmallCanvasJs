/**
 * @copyright @makarasty
 */
const canvas = /**@type {HTMLCanvasElement}*/(document.getElementById('anyCanvas'));
const ctx = canvas.getContext('2d');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

/**
 * @type {MyFunc[]}
 */
const myFunctions = []
const myEntrees = []

const scale = 24;
const gSize = 20

const enterX = /**@type {HTMLInputElement}*/(document.getElementById('enterX'));
const enterY = /**@type {HTMLInputElement}*/(document.getElementById('enterY'));
const addEnter = /**@type {HTMLButtonElement}*/(document.getElementById('addEnter'));
const entrees = /**@type {HTMLDivElement}*/(document.getElementById('entrees'));

/** @typedef {(x: number, y: number) => unknown | any} MyRenderFunction */

/** @typedef {(x: number) => number} MyFuncRunFunction */

class MyFunc {
	/**
	 * @param {string} name
	 * @param {string | CanvasGradient | CanvasPattern} color
	 * @param {MyFuncRunFunction} run
	 */
	constructor(name, color, run) {
		this.name = name;
		this.color = color;
		this.run = run;
	}
}

class MyEntry {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.entryX = x;
		this.entryY = y;
	}
}

addEnter.addEventListener("click", (event) => {
	if (Number(enterX.value) === 0 && Number(enterY.value) === 0) return;
	if (isNaN(Number(enterX.value)) && isNaN(Number(enterY.value))) return;

	const ent = new MyEntry(Number(enterX.value), Number(enterY.value))
	myEntrees.push(ent)
	addEntryToMyDiv(ent)

	enterX.value = ''
	enterY.value = ''
})

/**
 * @param {MyEntry} ent
*/
function addEntryToMyDiv(ent) {
	const newP = document.createElement("p");
	newP.innerHTML = `X= ${ent.entryX}; Y= ${ent.entryY};`;
	entrees.appendChild(newP)
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function renderCoordinateSystem(ctx) {
	// Лінії
	ctx.beginPath();
	ctx.moveTo(0, centerY);
	ctx.lineTo(canvas.width, centerY);
	ctx.moveTo(centerX, 0);
	ctx.lineTo(centerX, canvas.height);
	ctx.strokeStyle = 'black';
	ctx.stroke();

	// Палочки верх-низ
	ctx.fillStyle = 'black';
	for (let x = -gSize; x <= gSize; x++) {
		ctx.fillText(String(x), centerX + x * scale - 7, centerY + 15);
		if (x !== 0) {
			ctx.beginPath();
			ctx.moveTo(centerX + x * scale, centerY - 5);
			ctx.lineTo(centerX + x * scale, centerY + 5);
			ctx.stroke();
		}
	}

	// Палочки ліво-право
	for (let y = -gSize; y <= gSize; y++) {
		ctx.fillText(String(y), centerX - 20, centerY - y * scale + 4);
		if (y !== 0) {
			ctx.beginPath();
			ctx.moveTo(centerX - 5, centerY - y * scale);
			ctx.lineTo(centerX + 5, centerY - y * scale);
			ctx.stroke();
		}
	}
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {MyFunc} func
 * @param {number} index
 */
function renderFormulaName(ctx, func, index) {
	ctx.fillStyle = func.color;
	ctx.fillText(func.name, 0, (index * (scale - 10)));
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {MyFunc[]} functions
 */
function renderFunctions(ctx, functions) {
	ctx.font = '12px Arial';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';

	for (let i = 0; i < functions.length; i++) {
		const func = functions[i];
		// Глобал колор
		ctx.strokeStyle = func.color;

		// Ім'я зліва зверху
		renderFormulaName(ctx, func, i);

		ctx.beginPath();

		// Графіки
		const minX = centerX - gSize * scale
		const maxX = centerX + gSize * scale

		for (let XPixel = minX; XPixel <= maxX; XPixel++) {

			const x = (XPixel - centerX) / scale
			const y = func.run(x)

			const YPixel = centerY - y * scale;

			ctx.lineTo(XPixel, YPixel);
		}

		ctx.stroke();
	}
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {MyFunc[]} functions
 */
function render(ctx, functions) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	renderCoordinateSystem(ctx);
	renderFunctions(ctx, functions);
}

myFunctions.push(
	new MyFunc('(x+2)^2-2', 'blue', (x) => {
		return Math.pow((x + 2), 2 - 2)
	})
)
myFunctions.push(
	new MyFunc('2*sin(x/2)+3', 'red', (x) => {
		return 2 * Math.sin(x / 2) + 3
	})
)
myFunctions.push(
	new MyFunc('(2/3)*x-1', 'green', (x) => {
		return (2 / 3) * x - 1
	})
)

render(ctx, myFunctions)