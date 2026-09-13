/**
 * Utility to strip LaTeX code syntax and convert math formulas
 * to clean, readable plain text with standard Unicode characters.
 */

export function cleanMathAndLaTeX(input: string): string {
  if (!input) return "";

  let text = input;

  // 1. Remove ```latex or ```math or ```katex code fence tags, keeping inner content as plain text
  text = text.replace(/```(?:latex|math|katex)\s*([\s\S]*?)```/gi, (_match, code) => {
    return code.trim();
  });

  // 2. Replace text-formatting commands FIRST so nested braces inside \frac or \sqrt are resolved:
  // e.g. \text{...}, \mathrm{...}, \mathbf{...}, \mathit{...} -> inner content
  for (let i = 0; i < 3; i++) {
    text = text.replace(/\\(?:text|mathrm|mathbf|mathit|textbf|textit|sf|rm|cal)\s*\{([^{}]+)\}/g, "$1");
  }

  // 3. Replace fractions: \frac{num}{den} -> (num / den) or num / den
  for (let i = 0; i < 3; i++) {
    text = text.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "($1 / $2)");
  }
  text = text.replace(/\\frac\s*([a-zA-Z0-9])\s*([a-zA-Z0-9])/g, "($1 / $2)");

  // 4. Replace square roots: \sqrt{x} -> √(x)
  text = text.replace(/\\sqrt\s*\{([^{}]+)\}/g, "√($1)");
  text = text.replace(/\\sqrt\s*([a-zA-Z0-9])/g, "√$1");

  // Replace chemical / reaction arrows: \xrightarrow[...]{...} -> →
  text = text.replace(/\\xrightarrow(?:\[[^\]]*\])?\{([^{}]*)\}/g, "→ ($1) →");

  // Mathematical & scientific symbols
  const latexSymbols: Record<string, string> = {
    "\\\\times": "×",
    "\\\\cdot": "·",
    "\\\\div": "÷",
    "\\\\pm": "±",
    "\\\\mp": "∓",
    "\\\\approx": "≈",
    "\\\\neq": "≠",
    "\\\\leq": "≤",
    "\\\\geq": "≥",
    "\\\\rightarrow": "→",
    "\\\\leftarrow": "←",
    "\\\\Rightarrow": "⇒",
    "\\\\Leftarrow": "⇐",
    "\\\\to": "→",
    "\\\\infty": "∞",
    "\\\\partial": "∂",
    "\\\\nabla": "∇",
    "\\\\sum": "Σ",
    "\\\\prod": "Π",
    "\\\\int": "∫",
    "\\\\degree": "°",
    "\\\\circ": "°",

    // Greek letters
    "\\\\alpha": "α",
    "\\\\beta": "β",
    "\\\\gamma": "γ",
    "\\\\Gamma": "Γ",
    "\\\\delta": "δ",
    "\\\\Delta": "Δ",
    "\\\\epsilon": "ε",
    "\\\\theta": "θ",
    "\\\\Theta": "Θ",
    "\\\\lambda": "λ",
    "\\\\Lambda": "Λ",
    "\\\\mu": "μ",
    "\\\\nu": "ν",
    "\\\\pi": "π",
    "\\\\Pi": "Π",
    "\\\\rho": "ρ",
    "\\\\sigma": "σ",
    "\\\\Sigma": "Σ",
    "\\\\tau": "τ",
    "\\\\phi": "φ",
    "\\\\Phi": "Φ",
    "\\\\omega": "ω",
    "\\\\Omega": "Ω",
  };

  for (const [pattern, replacement] of Object.entries(latexSymbols)) {
    text = text.replace(new RegExp(pattern, "g"), replacement);
  }

  // Superscripts replacement for simple exponents: ^2 -> ², ^3 -> ³, ^n -> ⁿ, etc.
  const superscriptMap: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    "n": "ⁿ", "x": "ˣ", "y": "ʸ"
  };

  // Convert ^{...} or ^(\d)
  text = text.replace(/\^\{([0-9+\-nxy]+)\}/g, (_m, chars) => {
    return chars.split("").map((c: string) => superscriptMap[c] || c).join("");
  });
  text = text.replace(/\^([0-9nxy])/g, (_m, char) => superscriptMap[char] || char);

  // Subscripts replacement for simple subscripts: _1 -> ₁, _2 -> ₂, etc.
  const subscriptMap: Record<string, string> = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
    "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "a": "ₐ", "e": "ₑ", "i": "ᵢ", "o": "ₒ", "u": "ᵤ",
    "x": "ₓ"
  };
  text = text.replace(/_\{([0-9aeioux]+)\}/g, (_m, chars) => {
    return chars.split("").map((c: string) => subscriptMap[c] || c).join("");
  });
  text = text.replace(/_([0-9aeioux])/g, (_m, char) => subscriptMap[char] || char);

  // Common units cleanup: kg/m^3 -> kg/m³, g/cm^3 -> g/cm³, m/s^2 -> m/s²
  text = text.replace(/kg\/m\^3/g, "kg/m³");
  text = text.replace(/g\/cm\^3/g, "g/cm³");
  text = text.replace(/m\/s\^2/g, "m/s²");
  text = text.replace(/cm\^2/g, "cm²");
  text = text.replace(/cm\^3/g, "cm³");
  text = text.replace(/m\^2/g, "m²");
  text = text.replace(/m\^3/g, "m³");

  // Strip remaining double dollar signs $$ ... $$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_match, inner) => {
    return inner.trim();
  });

  // Strip single dollar signs $ ... $ (avoiding currency amounts like $50 or $100)
  // Matches $formula$ where it contains non-currency tokens
  text = text.replace(/(^|[^\\$])\$([^\$\n]+?)\$(?!\d)/g, (_match, prefix, inner) => {
    // If it's just a number like $100, keep it
    if (/^\d+(\.\d+)?$/.test(inner.trim())) {
      return `${prefix}$${inner}`;
    }
    return `${prefix}${inner.trim()}`;
  });

  // Clean any remaining standalone backslashes before words: e.g. \left, \right, \quad, \,
  text = text.replace(/\\(left|right|quad|qquad|,|;|!)\s*/g, " ");
  // Remove leftover unescaped backslashes before alphanumeric words (like \rho if missed)
  text = text.replace(/\\([a-zA-Z]+)/g, "$1");

  return text;
}
