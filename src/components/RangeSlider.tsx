import React from "react";

interface RangeSliderProps {
    min: number;
    max: number;
    value: { min: number; max: number };
    step: number;
    onChange: (value: { min: number; max: number }) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, value, step, onChange }) => {
    const [minValue, setMinValue] = React.useState(value ? value.min : min);
    const [maxValue, setMaxValue] = React.useState(value ? value.max : max);

    React.useEffect(() => {
        if (value) {
            setMinValue(value.min);
            setMaxValue(value.max);
        }
    }, [value]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const newMinVal = Math.min(+e.target.value, maxValue - step);
        if (!value) setMinValue(newMinVal);
        onChange({ min: newMinVal, max: maxValue });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const newMaxVal = Math.max(+e.target.value, minValue + step);
        if (!value) setMaxValue(newMaxVal);
        onChange({ min: minValue, max: newMaxVal });
    };

    const minPos = ((minValue - min) / (max - min)) * 100;
    const maxPos = ((maxValue - min) / (max - min)) * 100;

    return (
        <div className="">
            <div className="">
                <input
                    className="absolute h-1 bg-gray-300 rounded-md appearance-none"
                    type="range"
                    value={minValue}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleMinChange}
                />
                <input
                    className="absolute h-1 bg-gray-300 rounded-md appearance-none"
                    type="range"
                    value={maxValue}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleMaxChange}
                />
            </div>

            {/* <div className="relative ">
                <div
                    className="absolute top-0 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${minPos}%` }}
                />
                <div className="absolute top-0 left-0 w-1 h-1 bg-gray-300">
                    <div
                        className="absolute h-1 bg-blue-600 rounded-md"
                        style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
                    />
                </div>
                <div
                    className="absolute top-0 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${maxPos}%` }}
                />
            </div> */}
        </div>
    );
};

export default RangeSlider;
