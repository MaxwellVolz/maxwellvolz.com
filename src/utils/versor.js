// versor.js
const versor = {
    cartesian: ([longitude, latitude]) => {
        const lambda = (longitude * Math.PI) / 180,
            phi = (latitude * Math.PI) / 180,
            cosPhi = Math.cos(phi);
        return [cosPhi * Math.cos(lambda), cosPhi * Math.sin(lambda), Math.sin(phi)];
    },
    dot: (v0, v1) => v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2],
    cross: (v0, v1) => [
        v0[1] * v1[2] - v0[2] * v1[1],
        v0[2] * v1[0] - v0[0] * v1[2],
        v0[0] * v1[1] - v0[1] * v1[0]
    ],
    normalize: (d) => {
        const length = Math.sqrt(versor.dot(d, d));
        return d.map((x) => x / length);
    },
    quaternion: (a, b) => {
        const w = versor.cross(a, b),
            wLength = Math.sqrt(versor.dot(w, w));
        if (wLength === 0)
            return [1, 0, 0, 0];
        const c = Math.sqrt(versor.dot(a, b)),
            s = Math.sqrt((1 + c) * 2);
        const ws = w.map(x => x / wLength / s);
        return [s / 2, ws[0], ws[1], ws[2]];
    },
    multiply: (q1, q2) => {
        const [a1, b1, c1, d1] = q1,
            [a2, b2, c2, d2] = q2;
        return [
            a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
            a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
            a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
            a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2
        ];
    },
    rotation: (q) => [0, 0, -q[2], q[3]]
};

export default versor;
