import { useEffect, useRef } from 'react';
import './BackgroundPattern.css';

const BackgroundPattern = () => {
    const canvasRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });

    // Sample stock tickers
    const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'BAC', 'GS'];
    const changes = ['+1.42', '-0.87', '+2.31', '+0.95', '-1.23', '+3.45', '-0.76', '+1.89', '-2.10', '+1.56'];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            mousePosition.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        // Create grid of tickers
        const gridSize = { x: 120, y: 50 };
        const ticks = [];

        // Calculate number of complete tickers that fit
        const numCols = Math.floor(canvas.width / gridSize.x);
        const numRows = Math.floor(canvas.height / gridSize.y);

        // Calculate offset to center the grid
        const offsetX = (canvas.width - (numCols * gridSize.x)) / 2;
        const offsetY = (canvas.height - (numRows * gridSize.y)) / 2;

        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                const tickerIndex = Math.floor(Math.random() * tickers.length);
                ticks.push({
                    x: offsetX + (i * gridSize.x),
                    y: offsetY + (j * gridSize.y),
                    ticker: tickers[tickerIndex],
                    change: changes[tickerIndex]
                });
            }
        }

        const animate = () => {
            ctx.fillStyle = '#0a0c10';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw ticker content first
            ticks.forEach(tick => {
                ctx.save();

                // Calculate distance from mouse to ticker
                const dx = mousePosition.current.x - tick.x;
                const dy = mousePosition.current.y - tick.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Apply hover effect based on distance
                const effectRadius = 60;
                const maxZoom = 1.01;
                const maxGlow = 0.2;

                let scale = 1;
                let glowIntensity = 0;
                if (distance < effectRadius) {
                    scale = 1 + (maxZoom - 1) * (1 - distance / effectRadius);
                    glowIntensity = maxGlow * (1 - distance / effectRadius);

                    // Add subtle glow effect to the background
                    ctx.fillStyle = `rgba(51, 153, 255, ${glowIntensity * 0.1})`;
                    ctx.fillRect(tick.x, tick.y, gridSize.x, gridSize.y);
                }

                // Draw block background with hover effect
                const baseBackgroundOpacity = 0.95;
                const hoverBackgroundOpacity = 0.85;
                const backgroundOpacity = distance < effectRadius
                    ? baseBackgroundOpacity - ((baseBackgroundOpacity - hoverBackgroundOpacity) * (1 - distance / effectRadius))
                    : baseBackgroundOpacity;

                // Use a slightly lighter color when hovering
                const baseBgColor = 'rgba(0, 0, 0';
                const hoverBgColor = 'rgba(10, 10, 10';
                const backgroundColor = distance < effectRadius
                    ? hoverBgColor
                    : baseBgColor;

                ctx.fillStyle = `${backgroundColor}, ${backgroundOpacity})`;
                ctx.fillRect(tick.x, tick.y, gridSize.x, gridSize.y);

                // Draw ticker text
                ctx.font = '14px "Courier New", monospace';
                ctx.textAlign = 'center';

                // Draw ticker symbol with adjusted brightness
                ctx.fillStyle = distance < effectRadius
                    ? `rgba(255, 255, 255, ${0.9 + glowIntensity})`
                    : 'rgba(255, 255, 255, 0.9)';
                const symbol = tick.ticker.split('').join(' ');
                ctx.fillText(symbol, tick.x + gridSize.x / 2, tick.y + gridSize.y / 2 - 5);

                // Draw price change with adjusted color
                const baseColor = tick.change.startsWith('+')
                    ? [0, 255, 0]
                    : [255, 0, 0];
                ctx.fillStyle = distance < effectRadius
                    ? `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${0.9 + glowIntensity})`
                    : `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.9)`;
                const change = tick.change.split('').join(' ');
                ctx.fillText(change, tick.x + gridSize.x / 2, tick.y + gridSize.y / 2 + 15);

                ctx.restore();
            });

            // Draw grid lines last (on top of everything)
            ticks.forEach(tick => {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 1;
                ctx.strokeRect(tick.x, tick.y, gridSize.x, gridSize.y);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="background-pattern" />;
};

export default BackgroundPattern; 