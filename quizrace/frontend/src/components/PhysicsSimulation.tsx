import { useEffect, useRef, useState } from "react";

interface PhysicsSimulationProps {
  simulation: any;
  onAnswer: (answer: any) => void;
  disabled: boolean;
}

export function PhysicsSimulation({ simulation, onAnswer, disabled }: PhysicsSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [velocity, setVelocity] = useState(0);
  const [length, setLength] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [animationId, setAnimationId] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let frameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (simulation.type === "projectile") {
        // Draw ground
        ctx.fillStyle = "#4a5568";
        ctx.fillRect(0, height - 20, width, 20);

        // Draw ball
        const ballY = height - 20 - position.y;
        const ballX = width / 2 + position.x;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#4299e1";
        ctx.fill();
        ctx.strokeStyle = "#2b6cb0";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw velocity vector
        if (velocity > 0) {
          ctx.strokeStyle = "#f56565";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ballX, ballY);
          ctx.lineTo(ballX, ballY - velocity * 5);
          ctx.stroke();
        }
      } else if (simulation.type === "collision") {
        // Draw object A
        ctx.fillStyle = "#4299e1";
        ctx.fillRect(50, height / 2 - 25, 50, 50);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("A", 75, height / 2 + 5);

        // Draw object B
        ctx.fillStyle = "#48bb78";
        ctx.fillRect(200, height / 2 - 25, 50, 50);
        ctx.fillText("B", 225, height / 2 + 5);

        // Draw velocity indicators
        ctx.strokeStyle = "#f56565";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, height / 2);
        ctx.lineTo(100 + velocity * 10, height / 2);
        ctx.stroke();
      } else if (simulation.type === "pendulum") {
        const pivotX = width / 2;
        const pivotY = 50;
        const angle = Math.sin(Date.now() / 1000) * 0.5;
        const endX = pivotX + Math.sin(angle) * length * 100;
        const endY = pivotY + Math.cos(angle) * length * 100;

        // Draw string
        ctx.strokeStyle = "#718096";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw bob
        ctx.beginPath();
        ctx.arc(endX, endY, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#4299e1";
        ctx.fill();
      } else if (simulation.type === "acceleration") {
        // Draw car
        ctx.fillStyle = "#4299e1";
        ctx.fillRect(50, height / 2 - 20, 80, 40);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.fillText("Car", 75, height / 2 + 5);

        // Draw velocity indicator
        ctx.strokeStyle = "#f56565";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(130, height / 2);
        ctx.lineTo(130 + velocity * 5, height / 2);
        ctx.stroke();
      } else if (simulation.type === "spring") {
        // Draw spring
        const springX = width / 2;
        const springY = height / 2;
        const springLength = 100 + length * 50;
        
        ctx.strokeStyle = "#9f7aea";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const x = springX - springLength / 2 + (i * springLength / 10);
          const y = springY + Math.sin(i * 2) * 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw mass
        ctx.fillStyle = "#4299e1";
        ctx.fillRect(springX + springLength / 2 - 15, springY - 15, 30, 30);
      } else if (simulation.type === "circuit") {
        // Draw battery
        ctx.fillStyle = "#48bb78";
        ctx.fillRect(50, height / 2 - 15, 20, 30);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, height / 2 - 10);
        ctx.lineTo(60, height / 2 + 10);
        ctx.stroke();

        // Draw resistor
        ctx.fillStyle = "#ed8936";
        ctx.fillRect(150, height / 2 - 10, 40, 20);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(155 + i * 8, height / 2 - 10);
          ctx.lineTo(155 + i * 8, height / 2 + 10);
          ctx.stroke();
        }

        // Draw current indicator
        ctx.strokeStyle = "#f56565";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(70, height / 2);
        ctx.lineTo(150, height / 2);
        ctx.stroke();
      } else if (simulation.type === "projectile-angle") {
        // Draw ground
        ctx.fillStyle = "#4a5568";
        ctx.fillRect(0, height - 20, width, 20);

        // Draw trajectory
        const angleRad = (simulation.angle * Math.PI) / 180;
        const v0 = simulation.initialVelocity;
        const maxHeight = (v0 * v0 * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * simulation.gravity);
        const range = (v0 * v0 * Math.sin(2 * angleRad)) / simulation.gravity;

        ctx.strokeStyle = "#9f7aea";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let t = 0; t < 2; t += 0.1) {
          const x = width / 4 + (t * range * 5);
          const y = height - 20 - (v0 * Math.sin(angleRad) * t - 0.5 * simulation.gravity * t * t) * 5;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw ball at max height
        const maxHeightY = height - 20 - maxHeight * 5;
        ctx.beginPath();
        ctx.arc(width / 2, maxHeightY, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#4299e1";
        ctx.fill();
      }
    };

    const animate = () => {
      draw();
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [simulation, velocity, length, position]);

  const handleSubmit = () => {
    let isCorrect = false;

    if (simulation.type === "projectile") {
      const correctVel = Math.sqrt(2 * simulation.gravity * simulation.initialHeight);
      isCorrect = Math.abs(velocity - correctVel) < simulation.tolerance;
    } else if (simulation.type === "collision") {
      // Simplified collision check
      const v1 = (simulation.massA - simulation.massB) / (simulation.massA + simulation.massB) * simulation.velocityA;
      isCorrect = Math.abs(velocity - v1) < simulation.tolerance;
    } else if (simulation.type === "pendulum") {
      const correctLen = (simulation.period / (2 * Math.PI)) ** 2 * simulation.gravity;
      isCorrect = Math.abs(length - correctLen) < simulation.tolerance;
    } else if (simulation.type === "acceleration") {
      isCorrect = Math.abs(velocity - simulation.correctAcceleration) < simulation.tolerance;
    } else if (simulation.type === "spring") {
      const correctEnergy = 0.5 * simulation.springConstant * length * length;
      isCorrect = Math.abs(length - Math.sqrt(simulation.correctEnergy * 2 / simulation.springConstant)) < simulation.tolerance;
    } else if (simulation.type === "circuit") {
      const correctCurrent = simulation.voltage / simulation.resistance;
      isCorrect = Math.abs(velocity - correctCurrent) < simulation.tolerance;
    } else if (simulation.type === "projectile-angle") {
      const correctHeight = (simulation.initialVelocity * simulation.initialVelocity * Math.sin((simulation.angle * Math.PI) / 180) * Math.sin((simulation.angle * Math.PI) / 180)) / (2 * simulation.gravity);
      isCorrect = Math.abs(length - correctHeight) < simulation.tolerance;
    }

    onAnswer({
      velocity,
      length,
      position,
      isCorrect,
    });
  };

  return (
    <div className="physics-simulation">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{
          border: "2px solid #4299e1",
          borderRadius: "8px",
          background: "#1a202c",
        }}
      />
      <div className="simulation-controls">
        {simulation.type === "projectile" && (
          <div className="control-group">
            <label>Velocity (m/s): {velocity.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        {simulation.type === "pendulum" && (
          <div className="control-group">
            <label>Length (m): {length.toFixed(3)}</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.01"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        {simulation.type === "collision" && (
          <div className="control-group">
            <label>Final Velocity A (m/s): {velocity.toFixed(2)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        {simulation.type === "acceleration" && (
          <div className="control-group">
            <label>Acceleration (m/s²): {velocity.toFixed(3)}</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        {simulation.type === "spring" && (
          <div className="control-group">
            <label>Displacement (m): {length.toFixed(3)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        {simulation.type === "circuit" && (
          <div className="control-group">
            <label>Current (A): {velocity.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        {simulation.type === "projectile-angle" && (
          <div className="control-group">
            <label>Max Height (m): {length.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              disabled={disabled}
            />
          </div>
        )}
        <button
          className="submit-simulation-button"
          onClick={handleSubmit}
          disabled={disabled}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

