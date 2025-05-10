import {Link} from "react-router"
import moment from "moment"
import {getNextTestResultIdentifier} from "./components/index.js"

export const TestCompleted = ({
                                  setTestCompleted,
                                  setQuestionIndex,
                                  correctAnswers,
                                  allQuestions,
                                  resetSelectedAnswers,
                              }) => {
    const handleRestartClick = () => {
        setQuestionIndex(0)
        setTestCompleted(false)
        resetSelectedAnswers()
    }

    const renderAnswer = (correctAnswers, allQuestions) => {
        if (correctAnswers >= allQuestions / 2) {
            return <div className="fs-1 text-success">
                {correctAnswers} / {allQuestions}
            </div>
        }
        if (correctAnswers < allQuestions / 2) {
            return <div className="fs-1 text-danger">
                {correctAnswers} / {allQuestions}
            </div>
        }
    }

    const formatDate = (date) => {
        return moment(date).format("DD.MM.YYYY HH:mm");
    };

    const now = new Date();
    const date = formatDate(now);

    const saveTestResult = () => {
        const identifier = getNextTestResultIdentifier()

        const testResult = {
            testDate: date,
            correctAnswers: correctAnswers,
            allQuestions: allQuestions,
        };

        const serializedData = JSON.stringify(testResult);

        localStorage.setItem(identifier, serializedData);

        return identifier
    };

    return (
        <div className="text-center">
            <h1>Тест завершен</h1>
            <p>Правильных ответов:</p>
            {renderAnswer(correctAnswers, allQuestions)}
            <div className="d-flex flex-row gap-3 justify-content-center mt-4 fs-5">
                <Link to="/" onClick={saveTestResult}>
                    <button>На главную</button>
                </Link>
                <button onClick={handleRestartClick}>Начать заново</button>
            </div>
        </div>
    )
}