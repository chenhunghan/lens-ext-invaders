import React, { useEffect } from "react"
import p5 from 'p5';

const sketch = (p: p5) => {
    let x = 300;
    let y = 300;
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
    };
};

const ClusterPage = (): JSX.Element => {
    useEffect(() => {
        new p5(sketch);
    }, [])
    return (
        <>
        </>
    )
}

export default ClusterPage
