import React, { useEffect, useState } from 'react';
import BellCurveChart from '../components/BellCurveChart';
import { processSheetData } from '../utils/processData';
import { ResponseCounts } from '../utils/processData';
import { calculateMarginOfError } from "../utils/calculations";

const renderQuestion = (question: string) => {
  const parts = question.split('*');
  return (
    <h2 className="text-xl mb-4">
      {parts.map((part, index) => {
        return index % 2 === 0 ? part : <strong key={index}>{part}</strong>;
      })}
    </h2>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<{ questionData: number[]; responseCounts: ResponseCounts }[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [maxCount, setMaxCount] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalResponsesFullDataSet, setTotalResponsesFullDataSet] = useState(0);
  const [selectedRange, setSelectedRange] = useState({ min: 0, max: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const response = await fetch(process.env.NEXT_PUBLIC_MY_SECRET_URL as string);
    const result = await response.json();
    setFetchedData(result);
    setIsLoading(false);
  }

  function changeData(min = 0, max?: number) {
    if (fetchedData === null) {
      console.error("Fetching data failed.");
      return;
    }

    const { questionData, questionResponses, questions } = processSheetData(fetchedData, min, max);

    const totalResponses = questionResponses.length > 0
      ? (questionResponses[1]["Strongly disagree"]
        + questionResponses[1]["Disagree"]
        + questionResponses[1]["Neutral"]
        + questionResponses[1]["Agree"]
        + questionResponses[1]["Strongly agree"])
      : 0;

    if (min === 0 && max === undefined) {
      setTotalResponsesFullDataSet(totalResponses);
    }

    if (max === undefined) {
      max = totalResponses;
    }

    const maxCount = questionResponses.reduce((max, response) => {
      return Math.max(max, ...Object.values(response));
    }, 0);

    const data = questionData.map((qData, index) => ({
      questionData: qData,
      responseCounts: questionResponses[index],
    }));

    setData(data);
    setQuestions(questions);
    setMaxCount(maxCount);
    setTotalResponses(totalResponses);
    setSelectedRange({ min: min, max: max });
  }

  useEffect(() => {
    if (fetchedData !== null) {
      changeData();
    }
  }, [fetchedData]);

  useEffect(() => {
    setSelectedRange((prevRange) => ({ ...prevRange, max: prevRange.max }));
  }, [totalResponses]);

  const handleApplyClick = () => {
    changeData(selectedRange.min, selectedRange.max)
  };

  // Margin of error
  const populationSize = 120;
  const confidenceLevel = "95%";
  const marginOfError = calculateMarginOfError(totalResponses, populationSize, confidenceLevel);

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-1 justify-left gap-4 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          <span className="ml-2">Data is loading...</span>
        </div>
      ) : (
        <>
          <h1 className='text-3xl'>LLMs at Torchbox</h1>
          <h4 className='text-lg'>Total responses: {totalResponsesFullDataSet}</h4>
          <button
            className="mb-4 text-left text-blue-600 hover:text-blue-800 focus:outline-none"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            Segment responses {isAccordionOpen ? "▲" : "▼"}
          </button>
          {isAccordionOpen && (
            <div className="mb-4">
              <h4 className='text-lg'>Segmented responses: {totalResponses} - Margin of error {marginOfError}</h4>
              <label>
                From
                <input
                  className="ml-2 border-2 border-gray-200 rounded-md p-1"
                  type="number"
                  value={selectedRange.min}
                  onChange={(e) =>
                    setSelectedRange({ ...selectedRange, min: parseInt(e.target.value) })
                  }
                />
              </label>
              <label className="ml-4">
                To
                <input
                  className="ml-2 border-2 border-gray-200 rounded-md p-1"
                  type="number"
                  value={selectedRange.max}
                  onChange={(e) =>
                    setSelectedRange({ ...selectedRange, max: parseInt(e.target.value) })
                  }
                />
              </label>
              <button
                className="ml-4 px-4 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                onClick={handleApplyClick}
              >
                Apply
              </button>
            </div>
          )}
          {data.map(({ questionData, responseCounts }, index) => (
            <div key={index} className="my-8">
              {renderQuestion(questions[index])}
              <BellCurveChart data={questionData} responseCounts={responseCounts} maxCount={maxCount} />
            </div>
          ))}
        </>
      )
      }
    </div>
  )
}

export default App;
