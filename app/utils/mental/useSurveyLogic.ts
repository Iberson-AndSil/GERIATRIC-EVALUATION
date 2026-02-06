import { useState } from 'react';
import { FormInstance } from 'antd';
import { DimensionsConfig, QuestionGroup, SurveyResults, SurveyQuestion, DimensionConfig } from '../../type';

const useSurveyLogic = (
    form: FormInstance,
    dimensionsConfig: DimensionsConfig,
    questionGroups: QuestionGroup[]
) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<SurveyResults | null>(null);

    const allQuestions: SurveyQuestion[] = questionGroups.flatMap(group => group.questions);
    const totalQuestions = allQuestions.length;

    const calculateResults = (answers: Record<string, string>): SurveyResults => {
        const dimensionScores: {
            [key in keyof typeof dimensionsConfig]: {
                rawScore: number;
                maxPossible: number;
            } & DimensionConfig;
        } = {} as any;

        (Object.keys(dimensionsConfig) as (keyof typeof dimensionsConfig)[]).forEach(dimKey => {
            dimensionScores[dimKey] = {
                rawScore: 0,
                maxPossible: 0,
                ...dimensionsConfig[dimKey]
            };
        });

        (Object.keys(dimensionsConfig) as (keyof typeof dimensionsConfig)[]).forEach(dimKey => {
            const dimension = dimensionsConfig[dimKey];
            let rawScore = 0;
            let maxPossible = 0;

            dimension.questionIndexes.forEach(qIndex => {
                const question = allQuestions[qIndex];
                const answer = answers[`q${qIndex}`];

                if (answer !== undefined) {
                    const optionIndex = question.options.indexOf(answer);
                    if (optionIndex !== -1) {
                        rawScore += question.scores[optionIndex];
                        maxPossible += Math.max(...question.scores);
                    }
                }
            });

            dimensionScores[dimKey] = {
                ...dimensionScores[dimKey],
                rawScore,
                maxPossible
            };
        });

        const totalRawScore = (Object.keys(dimensionScores) as (keyof typeof dimensionsConfig)[]).reduce(
            (sum, dimKey) => sum + dimensionScores[dimKey].rawScore, 0
        );

        return {
            dimensions: dimensionScores,
            totalScore: totalRawScore,
            answers: answers
        };
    };

    const handleNext = async (answer: any) => {
        try {
            const values = await form.validateFields();
            const newAnswers = { ...answers, [`q${currentQuestion}`]: values.answer };
            setAnswers(newAnswers);

            if (currentQuestion < totalQuestions - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                const calculatedResults = calculateResults(newAnswers);
                setResults(calculatedResults);
                setSubmitted(true);
            }
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const resetEvaluation = () => {
        setCurrentQuestion(0);
        setSubmitted(false);
        setAnswers({});
        setResults(null);
        form.resetFields();
    };

    return {
        currentQuestion,
        submitted,
        results,
        answers,
        totalQuestions,
        allQuestions,
        handleNext,
        handlePrev,
        resetEvaluation,
        calculateResults,
        setResults,
        setSubmitted,
        setAnswers
    };
};

export default useSurveyLogic;