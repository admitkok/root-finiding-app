import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import * as math from "mathjs";
import "./App.css"; // Import custom CSS file

const RootFindingApp = () => {
  const [functionInput, setFunctionInput] = useState("x^2 - 5*sin(x) + x - 1");
  const [intervalStart, setIntervalStart] = useState(0);
  const [intervalEnd, setIntervalEnd] = useState(1);
  const [precision, setPrecision] = useState(0.001);
  const [results, setResults] = useState(null);

  const parseFunction = (input) => math.compile(input);
  const derivativeFunction = (input) => math.derivative(input, 'x').compile();

  const bisectionMethod = (f, a, b, tol) => {
    let mid, fa, fm;
    let iterations = 0;
    const errors = [];

    while (Math.abs(b - a) > tol) {
      iterations++;
      mid = (a + b) / 2;
      fa = f.evaluate({ x: a });
      fm = f.evaluate({ x: mid });

      errors.push({ iteration: iterations, error: Math.abs(b - a) });

      if (fa * fm < 0) b = mid;
      else a = mid;
    }
    return { root: mid, iterations, errors };
  };

  const newtonMethod = (f, df, x0, tol) => {
    let x = x0;
    let iterations = 0;
    const errors = [];

    while (true) {
      iterations++;
      const fx = f.evaluate({ x });
      const dfx = df.evaluate({ x });
      if (Math.abs(dfx) < 1e-10) break; // Prevent division by zero

      const nextX = x - fx / dfx;
      errors.push({ iteration: iterations, error: Math.abs(nextX - x) });
      if (Math.abs(nextX - x) < tol) break;

      x = nextX;
    }
    return { root: x, iterations, errors };
  };

  const fixedPointIteration = (x0, tol, maxIter = 100) => {
    let x = x0;
    let iterations = 0;
    const errors = [];

    while (iterations < maxIter) {
      iterations++;
      const nextX = x ** 2 - 2;
      errors.push({ iteration: iterations, error: Math.abs(nextX - x) });
      if (Math.abs(nextX - x) < tol) break;
      x = nextX;
    }
    return { root: x, iterations, errors };
  };

  const handleCalculate = () => {
    const f = parseFunction(functionInput);
    const df = derivativeFunction(functionInput);

    const bisectionResult = bisectionMethod(f, parseFloat(intervalStart), parseFloat(intervalEnd), parseFloat(precision));
    const newtonResult = newtonMethod(f, df, (parseFloat(intervalStart) + parseFloat(intervalEnd)) / 2, parseFloat(precision));
    const fixedPointResult = fixedPointIteration((parseFloat(intervalStart) + parseFloat(intervalEnd)) / 2, parseFloat(precision));

    setResults({ bisectionResult, newtonResult, fixedPointResult });
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Root Finding Application</h2>
        <div className="input-group">
          <label>Function:</label>
          <input type="text" value={functionInput} onChange={(e) => setFunctionInput(e.target.value)} />
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Interval Start:</label>
            <input type="number" value={intervalStart} onChange={(e) => setIntervalStart(e.target.value)} />
          </div>
          <div className="input-group" style={{position: "relative", left: "25px"}}>
            <label>Interval End:</label>
            <input type="number" value={intervalEnd} onChange={(e) => setIntervalEnd(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label>Precision:</label>
          <input type="number" value={precision} onChange={(e) => setPrecision(e.target.value)} />
        </div>
        <button className="btn" onClick={handleCalculate}>Calculate</button>
      </div>
      {results && (
        <div>
        <h3 className="title">Results</h3>
        <div className="card results">
          <div>
            <h4>Bisection Method:</h4>
            <p>Root: {results.bisectionResult.root}</p>
            <p>Iterations: {results.bisectionResult.iterations}</p>
            <LineChart width={400} height={200} data={results.bisectionResult.errors}>
              <XAxis dataKey="iteration" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="error" stroke="#8884d8" />
            </LineChart>
          </div>
          <div>
            <h4>Newton's Method:</h4>
            <p>Root: {results.newtonResult.root}</p>
            <p>Iterations: {results.newtonResult.iterations}</p>
            <LineChart width={400} height={200} data={results.newtonResult.errors}>
              <XAxis dataKey="iteration" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="error" stroke="#82ca9d" />
            </LineChart>
          </div>
          <div>
            <h4>Fixed Point Iteration:</h4>
            <p>Root: {results.fixedPointResult?.root}</p>
            <p>Iterations: {results.fixedPointResult?.iterations}</p>
            <LineChart width={400} height={200} data={results.fixedPointResult.errors}>
              <XAxis dataKey="iteration" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="error" stroke="#ff7300" />
            </LineChart>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default RootFindingApp;
