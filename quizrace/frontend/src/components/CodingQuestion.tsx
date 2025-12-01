import { useState } from "react";

interface CodingQuestionProps {
  codeTemplate: string;
  testCases: Array<{ input: any; expected: any }>;
  onAnswer: (code: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export function CodingQuestion({
  codeTemplate,
  testCases,
  onAnswer,
  disabled,
}: CodingQuestionProps) {
  const [code, setCode] = useState(codeTemplate);
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    input: any;
    expected: any;
    actual: any;
  }> | null>(null);

  const runTests = () => {
    try {
      // Create a safe execution context
      const func = new Function("return " + code)();
      const results = testCases.map((testCase) => {
        let actual;
        try {
          actual = func(testCase.input);
        } catch (e) {
          actual = "Error: " + (e as Error).message;
        }
        const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
        return {
          passed,
          input: testCase.input,
          expected: testCase.expected,
          actual,
        };
      });
      setTestResults(results);
      return results.every((r) => r.passed);
    } catch (error) {
      alert("Code execution error: " + (error as Error).message);
      return false;
    }
  };

  const handleSubmit = () => {
    const isCorrect = runTests();
    if (isCorrect) {
      onAnswer(code, true);
    } else {
      onAnswer(code, false);
    }
  };

  return (
    <div className="coding-question">
      <div className="code-editor-container">
        <textarea
          className="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={disabled}
          spellCheck={false}
        />
      </div>
      <div className="test-controls">
        <button
          className="run-tests-button"
          onClick={runTests}
          disabled={disabled}
        >
          Run Tests
        </button>
        <button
          className="submit-code-button"
          onClick={handleSubmit}
          disabled={disabled}
        >
          Submit Solution
        </button>
      </div>
      {testResults && (
        <div className="test-results">
          <h4>Test Results:</h4>
          {testResults.map((result, idx) => (
            <div
              key={idx}
              className={`test-result ${result.passed ? "passed" : "failed"}`}
            >
              <span className="test-icon">{result.passed ? "✓" : "✗"}</span>
              <span>
                Test {idx + 1}: Input: {JSON.stringify(result.input)} → Expected:{" "}
                {JSON.stringify(result.expected)}, Got: {JSON.stringify(result.actual)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

