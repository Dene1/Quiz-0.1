import {useEffect, useState} from "react"
import {TestCompleted} from "./components/index.js"

export const TestPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [quiz, setQuiz] = useState([])
    const [questionIndex, setQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState(Array(quiz.length).fill(null))
    const [testCompleted, setTestCompleted] = useState(false)
    const currentQuestion = quiz[questionIndex]
    console.log(quiz)
    console.log(selectedAnswers)


    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await fetch("http://localhost:5000")
            const data = await response.json()
            setQuiz(data[0].questions);
        }
        fetchQuizzes().finally(() => setIsLoading(false))
    }, [])

    const calculateScore = () => {
        let score = 0;
        for (let i = 0; i < quiz.length; i++) {
            const correctAnswers = quiz[i].answers.filter(answer => answer.correct).map(answer => answer._id);
            const selectedForQuestion = selectedAnswers[i] || [];
            if (correctAnswers.length === selectedForQuestion.length &&
                correctAnswers.every(answerId => selectedForQuestion.includes(answerId))) {
                score++;
            }
        }
        return score;
    };

    const handleNextClick = () => {
        if (questionIndex === quiz.length - 1) {
            setTestCompleted(true)
        } else {
            setQuestionIndex(prevIndex => prevIndex + 1)
        }
    }

    const handlePreviousClick = () => setQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0))
    const buttonBackDisabled = () => questionIndex === 0
    const buttonNextDisabled = () => selectedAnswers.length === 0

    const resetSelectedAnswers = () => {
        setSelectedAnswers([])
        setTestCompleted(false)
    };

    const handleAnswerSelect = (answerId) => {
        setSelectedAnswers(prevSelectedAnswers => {
            const newSelectedAnswers = [...prevSelectedAnswers];
            newSelectedAnswers[questionIndex] = [answerId]; // Заменяем все ответы на
                                                            // один выбранный
            return newSelectedAnswers;
        });
    };

    if (isLoading) {
        return (
            <div className="mt-20 d-flex justify-content-center mt-5">
                <div
                    className="d-flex justify-content-center spinner-border text-primary">
                </div>
            </div>
        )
    }

    return (
        <>
            {testCompleted ? (
                <TestCompleted
                    setTestCompleted={setSelectedAnswers}
                    setQuestionIndex={setQuestionIndex}
                    correctAnswers={calculateScore()}
                    allQuestions={quiz.length}
                    resetSelectedAnswers={resetSelectedAnswers}
                />
            ) : (
                <div>
                    <h1 className="text-center mt-3">Test page</h1>
                    <div className="w-50 mx-auto mt-5">
                        <p className="text-center fs-5">{questionIndex + 1} / {quiz.length}</p>
                        <div className="text-center fs-5">
                            {currentQuestion.title}
                        </div>

                        {currentQuestion.answers.map((answer) => (
                            <div className="form-check"
                                 onClick={() => handleAnswerSelect(answer._id)}
                                 style={{cursor: "pointer"}}
                                 key={answer._id}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={() => {
                                    }}
                                    name={`question-${questionIndex}`}
                                    checked={selectedAnswers[questionIndex]?.includes(answer._id)}
                                />
                                {answer.title}
                            </div>))}

                        <div
                            className="d-flex flex-row gap-3 justify-content-center mx-auto mt-4 fs-5">
                            <button onClick={handlePreviousClick}
                                    disabled={buttonBackDisabled()}>
                                Предыдущий вопрос
                            </button>
                            <button onClick={handleNextClick}
                                    disabled={buttonNextDisabled()}>
                                {questionIndex === quiz.length - 1 ? "Завершить" :
                                    "Следующий вопрос"}
                            </button>
                        </div>
                    </div>
                </div>)}
        </>
    )
}