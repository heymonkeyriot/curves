export interface ResponseCounts {
    "Strongly disagree": number;
    Disagree: number;
    Neutral: number;
    Agree: number;
    "Strongly agree": number;
}

export const initialResponseCounts: ResponseCounts = {
    "Strongly disagree": 0,
    Disagree: 0,
    Neutral: 0,
    Agree: 0,
    "Strongly agree": 0,
};

function processSheetData(rawData: { data: string[][] }, min?: number, max?: number): { questionData: number[][]; questionResponses: ResponseCounts[]; questions: string[] } {
    var data = rawData.data.slice(1); // Remove header row
    if (min !== undefined && max !== undefined) {
        data = data.slice(min, max);
    }
    const questions = rawData.data[0]; // Get the first row containing the questions
    const questionCount = 6;
    let questionResponses: ResponseCounts[] = [];

    // Initialize response counts for each question
    for (let i = 0; i < questionCount; i++) {
        questionResponses.push({ ...initialResponseCounts });
    }

    // Count responses for each question
    data.forEach((row: string[]) => {
        row.forEach((response: string, index: number) => {
            if (response in questionResponses[index]) {
                questionResponses[index][response as keyof ResponseCounts]++;
            }
        });
    });

    // Map response strings to their positions and output as arrays
    const responseOrder = [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
    ];

    const output = questionResponses.map((responseCounts) =>
        responseOrder.map((response) => responseCounts[response as keyof ResponseCounts]),
    );

    return {
        questionData: output,
        questionResponses,
        questions,
    };
}

export { processSheetData };
