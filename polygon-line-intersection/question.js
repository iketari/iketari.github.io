/*
    The goal of this exercise is to take a polygon defined by the points 'points', use the mouse
    events to draw a line that will split the polygon and then draw the two split polygons.
    In the start, you'll have the initial polygon (start.png)
    While dragging the mouse, the polygon should be shown along with the line you're drawing (mouseMove.png)
    After letting go of the mouse, the polygon will be split into two along that line (mouseUp.png)

    The code provided here can be used as a starting point using plain-old-Javascript, but it's fine
    to provide a solution using react/angular/vue/etc if you prefer.
*/

/**
 * 2D Point
 * @typedef {Object} Point
 * @property {number} x - The X coordinate.
 * @property {number} y - The Y coordinate.
 */

/**
* 2D Point of intersection
* @typedef {Object} IntersectionPoint
* @extends {Point}
* @property {number} t
* @property {number} u
*/

/**
* 2D Span
* @typedef {Point[]} Span
*/

const WIDTH = 500;
const HEIGH = 500;
let DEBUG = false;

/**
 * @type Point[]
 */
const LINE = [];
let isDrawing = false;

/**
 * MouseDown event handler
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
    const { x, y } = event;

    if (x > WIDTH && y > HEIGH) {
        return;
    }

    LINE.length = 0;
    LINE[0] = { x, y };
    isDrawing = true;
}

/**
 * MouseMove event handler
 * @param {MouseEvent} event
 */
function onMouseMove(event) {
    const { x, y } = event;

    if (x > WIDTH && y > HEIGH) {
        return;
    }

    if (!isDrawing) {
        return;
    }

    LINE[1] = { x, y };
    clearPoly();
    addPoly(points);
    addPoly(LINE, 'red');
}

/**
 * MouseUp event handler
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
    /**
     * @type Point[]
     */
    const poly1 = [];
    /**
     * @type Point[]
     */
    const poly2 = [];

    const { x, y } = event;
    let error = null;
    let intersections = 0;

    isDrawing = false;

    if (x > WIDTH && y > HEIGH) {
        return;
    }

    clearPoly();
    addPoly(points);

    if (!LINE[0] || !LINE[1]) {
        return;
    }

    if (DEBUG) {
        addPoly(LINE, 'red');
    }

    for (let polygonLine of getLines(points)) {
        let point = getIntersection(LINE, polygonLine);

        evaluatePoint(polygonLine[0], LINE, poly1, poly2);


        // check the others polygonLines have no intersection out of the LINE length
        for (let otherLine of getLines(points)) {
            if (isLinesEqual(otherLine, polygonLine)) {
                continue;
            }

            const externalIntersectionPoint = getIntersection(LINE, otherLine, true);
            const internalIntersectionPoint = getIntersection(LINE, otherLine);
            if (externalIntersectionPoint == null ||
                externalIntersectionPoint.u > 0 || externalIntersectionPoint.u < -1 || // an intersection point doesn't belong to a polygon edge
                internalIntersectionPoint != null && isPointsEqual(externalIntersectionPoint, internalIntersectionPoint)
            ) {
                continue;
            }

            addPoint(externalIntersectionPoint, 'red');
            error = 'Please intersect all possible edges by the red line.';
        }

        if (point != null) {
            addPointToPoly(point, poly1);
            addPointToPoly(point, poly2);
            intersections += 1;
        }

        evaluatePoint(polygonLine[1], LINE, poly1, poly2);
    }

    if (intersections === 0 && error == null) {
        error = 'Please intersect the polygon by the red line.';
    }


    if (error !== null) {
        addText(error);
        return;
    }

    addPoly(poly1, 'blue');
    addPoly(poly2, 'green');
}


// TODO: take into account the span's length
/**
 * Sorts points relative to the line
 * @param {Point} point
 * @param {Span} line
 * @param {Point[]} above
 * @param {Point[]} under
 */
function evaluatePoint(point, line, above, under) {
    if (isDotAboveLine(line, point) > 0) {
        addPointToPoly(point, above);
    } else if (isDotAboveLine(line, point) < 0) {
        addPointToPoly(point, under);
    }
}

/**
 * Adds unique points into array
 * @param {Point} param0
 * @param {Point[]} poly
 */
function addPointToPoly({ x: x1, y: y1 }, poly) {
    if (poly.find(({ x: x2, y: y2 }) => x1 === x2 && y1 === y2)) {
        return;
    };

    poly.push({ x: x1, y: y1 });
}

/**
 * Transforms a list of points to a list of lines
 * @param {Point[]} points
 * @returns {Span[]}
 */
function getLines(points) {
    const lines = [];

    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let nextPoint = points[i + 1 === points.length ? 0 : i + 1];

        lines.push([point, nextPoint]);
    }

    return lines;
}

/**
 * Determines whether a point lays below a line or not
 * @param {Span} param0
 * @param {Point} param1
 * @returns {number} - 1 - above, -1 - below, 0 - the point belongs to the line
 */
function isDotAboveLine([{ x: x1, y: y1 }, { x: x2, y: y2 }], { x: x3, y: y3 }) {
    return (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);
}

/**
 * Finds a point of intersection of two spans
 * @param {Span} param0 - first line
 * @param {Span} param1 - second line
 * @param {boolean} allIntersections - determine whether to look for intersection beyond spans length or not
 * @returns {IntersectionPoint} a point of intersection
 * @returns {null} no points of intersection were found (or the given lines are parallel)
 */
function getIntersection([{ x: x1, y: y1 }, { x: x2, y: y2 }], [{ x: x3, y: y3 }, { x: x4, y: y4 }], allIntersections = false) {
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    const u = ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) /
        ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if (!allIntersections && ((t < 0 || t > 1) || (u > 0 || u < -1))) {
        return null;
    }

    const x = x1 + t * (x2 - x1);
    const y = y1 + t * (y2 - y1);

    if (isNaN(x) || isNaN(y)) {
        return null;
    }

    return { x, y, t, u };
}

/**
 * Checks that spans are equal
 * @param {Span} span1 - first line
 * @param {Span} span2 - second line
 * @returns {boolean}
 */
function isLinesEqual(span1, span2) {
    return isPointsEqual(span1[0], span2[0]) && isPointsEqual(span1[1], span2[1]);
}

/**
 * Checks that points are equal
 * @param {Point} point1 - first point
 * @param {Point} point2 - second point
 * @returns {boolean}
 */
function isPointsEqual({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    return x1 === x2 && y1 === y2;
}

/**
 * Draws a point
 * @param {Point} point
 * @param {string} color
 */
function addPoint(point, color = 'black') {
    const svgElement = document.querySelector('#content svg');
    const svgCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

    svgCircle.setAttribute('cx', point.x);
    svgCircle.setAttribute('cy', point.y);
    svgCircle.setAttribute('r', 3);
    svgCircle.setAttribute('stroke', color);

    svgElement.appendChild(svgCircle);
}

/**
 * Draws a text message
 * @param {string} text
 */
function addText(text, color = 'red') {
    const svgElement = document.querySelector('#content svg');
    const svgText = document.createElementNS("http://www.w3.org/2000/svg", 'text');

    svgText.setAttribute('x', 20);
    svgText.setAttribute('y', HEIGH - 50);
    svgText.setAttribute('fill', color);
    svgText.textContent = text;

    svgElement.appendChild(svgText);
}

/*
	Code below this line shouldn't need to be changed
*/

//Draws a polygon from the given points and sets a stroke with the specified color
function addPoly(points, color = 'black') {
    if (points.length < 2) {
        console.error("Not enough points");
        return;
    }

    const content = document.getElementById('content');

    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let path = 'M' + points[0].x + ' ' + points[0].y

    for (const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);

    svgElement.setAttribute('height', "500");
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');

    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

//Clears the all the drawn polygons
function clearPoly() {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

//Sets the mouse events needed for the exercise
function setup() {
    this.clearPoly();
    this.addPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const points = [
    { x: 100, y: 100 },
    { x: 200, y: 50 },
    { x: 300, y: 50 },
    { x: 400, y: 200 },
    { x: 350, y: 250 },
    { x: 200, y: 300 },
    { x: 150, y: 300 },
]

window.onload = () => setup()
