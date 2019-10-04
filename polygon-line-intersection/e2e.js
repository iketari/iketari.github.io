
window.onload = null;
/**
 * @type {HTMLElement}
 */
let content = null;
/**
 * @type {HTMLElement}
 */
let results = null;

function runTests() {
    DEBUG = true;
    content = document.querySelector('#content');
    results = document.querySelector('#results');

    setConvexPolygon();

    renderCase(points, [{ x: 70, y: 150 }, { x: 450, y: 150 }], 'Convex. A horizontal line');
    renderCase(points, [{ x: 200, y: 40 }, { x: 200, y: 320 }], 'Convex. A vertical line');
    renderCase(points, [{ x: 100, y: 300 }, { x: 250, y: 300 }], 'Convex. A parallel line');
    renderCase(points, [{ x: 100, y: 320 }, { x: 250, y: 320 }], 'Convex. No intersections');
    renderCase(points, [{ x: 100, y: 320 }, { x: 250, y: 250 }], 'Convex. One intersection');
    renderCase(points, [{ x: 100, y: 150 }, { x: 450, y: 250 }], 'Convex. Two intersections (left to right)');
    renderCase(points, [{ x: 450, y: 250 }, { x: 100, y: 150 }], 'Convex. Two intersections (right to left)');
    renderCase(points, [{ x: 200, y: 50 }, { x: 200, y: 300 }], 'Convex. Two intersections (vertex)');

    setConcavePolygon();

    renderCase(points, [{ x: 70, y: 150 }, { x: 450, y: 150 }], 'Concave. A horizontal line');
    renderCase(points, [{ x: 200, y: 40 }, { x: 200, y: 320 }], 'Concave. A vertical line');
    renderCase(points, [{ x: 100, y: 300 }, { x: 250, y: 300 }], 'Concave. A parallel line');
    renderCase(points, [{ x: 100, y: 320 }, { x: 250, y: 320 }], 'Concave. No intersections');
    renderCase(points, [{ x: 100, y: 320 }, { x: 250, y: 250 }], 'Concave. One intersection');
    renderCase(points, [{ x: 100, y: 150 }, { x: 450, y: 250 }], 'Concave. Two intersections (left to right)');
    renderCase(points, [{ x: 450, y: 250 }, { x: 100, y: 150 }], 'Concave. Two intersections (right to left)');
    renderCase(points, [{ x: 200, y: 50 }, { x: 200, y: 300 }], 'Concave. Two intersections (vertex)');
    renderCase(points, [{ x: 323, y: 89 }, { x: 228, y: 319 }], 'Concave. Many intersections');

    setOverlappedPolygon();

    renderCase(points, [{ x: 70, y: 150 }, { x: 450, y: 150 }], 'Overlapped. A horizontal line');
    renderCase(points, [{ x: 200, y: 40 }, { x: 200, y: 320 }], 'Overlapped. A vertical line');
    renderCase(points, [{ x: 100, y: 300 }, { x: 250, y: 300 }], 'Overlapped. A parallel line');
    renderCase(points, [{ x: 100, y: 320 }, { x: 250, y: 320 }], 'Overlapped. No intersections');
    renderCase(points, [{ x: 170, y: 320 }, { x: 180, y: 310 }], 'Overlapped. No intersections');
    renderCase(points, [{ x: 100, y: 120 }, { x: 280, y: 150 }], 'Overlapped. One intersection');
    renderCase(points, [{ x: 100, y: 150 }, { x: 450, y: 250 }], 'Overlapped. Two intersections (left to right)');
    renderCase(points, [{ x: 450, y: 250 }, { x: 100, y: 150 }], 'Overlapped. Two intersections (right to left)');
    renderCase(points, [{ x: 200, y: 50 }, { x: 200, y: 300 }], 'Overlapped. Two intersections (vertex)');
    renderCase(points, [{ x: 323, y: 89 }, { x: 228, y: 319 }], 'Overlapped. Many intersections');

    content.remove();
}

/**
 * Render a test case
 * @param {Point[]} poly
 * @param {Span} LINE
 * @param {string} text
 */
function renderCase(poly, LINE, text = 'A test case description') {
    addPoly(poly);
    onMouseDown(LINE[0]);
    onMouseMove(LINE[1]);
    onMouseUp(LINE[1]);

    const copy = content.cloneNode(true);
    const textEl = document.createElement('h3');
    textEl.textContent = text;

    copy.removeAttribute('id');

    copy.append(textEl);
    results.append(copy);

    clearPoly();
}

function setConvexPolygon() {
    points.length = 0;
    [
        { x : 100, y: 100 },
        { x : 200, y: 50 },
        { x : 300, y: 50 },
        { x : 400, y: 200 },
        { x : 350, y: 250 },
        { x : 200, y: 300 },
        { x : 150, y: 300 },
    ].forEach(point => points.push(point));
}

function setConcavePolygon() {
    points.length = 0;
    [
        { x: 100, y: 100 },
        { x: 200, y: 50 },
        { x: 300, y: 50 },

        { x: 350, y: 250 },
        { x: 200, y: 300 },
        { x: 150, y: 300 },
        { x: 300, y: 200 },
    ].forEach(point => points.push(point));
}

function setOverlappedPolygon() {
    points.length = 0;
    [
        { x : 100, y: 100 },
        { x : 200, y: 50 },
        { x : 300, y: 50 },
        { x : 350, y: 250 },
        { x : 200, y: 300 },
        { x : 150, y: 300 },
    
        { x : 400, y: 200 },
    ].forEach(point => points.push(point));
}

window.onload = runTests;