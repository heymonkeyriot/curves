// calculations.ts
const zScoreForConfidenceLevel = {
    "90%": 1.645,
    "95%": 1.96,
    "99%": 2.576,
  };
  
  export function calculateMarginOfError(
    sampleSize: number,
    populationSize: number,
    confidenceLevel: keyof typeof zScoreForConfidenceLevel
  ): string {
    const proportion = 0.5; // Assuming the worst-case scenario (maximum variability)
    const zScore = zScoreForConfidenceLevel[confidenceLevel];
  
    const standardError = Math.sqrt(
      (proportion * (1 - proportion)) / sampleSize
    );
  
    const finitePopulationCorrection = Math.sqrt(
      (populationSize - sampleSize) / (populationSize - 1)
    );
  
    const marginOfError = zScore * standardError * finitePopulationCorrection;
  
    // Multiply by 100, round to the desired precision (e.g., 2 decimal places), and append the "%" symbol
    const marginOfErrorPercentage = (marginOfError * 100).toFixed(0) + "%";
  
    return marginOfErrorPercentage;
  }
  
  