import {Link} from "react-router"
import {useEffect, useState} from "react"
import moment from "moment"

export const MainPage = () => {
    const [sortedResults, setSortedResults] = useState([]);

    const loadTestResult = () => {
        const testResults = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("testResult_")) {
                const serializedData = localStorage.getItem(key);
                if (serializedData) {
                    try {
                        const testResult = JSON.parse(serializedData);
                        testResults.push({identifier: key, data: testResult});
                    } catch (error) {
                        console.error(`Error parsing test result with identifier: ${key}`, error);
                    }
                }
            }
        }
        return testResults;
    };

    const getAllTestResultsSortedByDate = () => {
        const testResults = [...loadTestResult()];

        testResults.sort((a, b) => {
            const dateA = moment(a.data.testDate, "DD.MM.YYYY HH:mm").toDate();
            const dateB = moment(b.data.testDate, "DD.MM.YYYY HH:mm").toDate();
            return dateB - dateA;
        });
        return testResults;
    }

    useEffect(() => {
        const results = getAllTestResultsSortedByDate();
        setSortedResults(results);
    }, []);

    const sum = (testResult) => {
        return testResult.data.correctAnswers / testResult.data.allQuestions * 100
    }

    return (
        <div className="text-center w-50 mx-auto ">
            <h1 className="mt-3">Quiz 0.1</h1>
            <div>
                <div
                    className=" d-flex flex-row gap-3 justify-content-center mx-auto mt-5 fs-5">
                    <Link to="/quiz/">
                        <button> Запустить тест</button>
                    </Link>
                    <Link to="/quiz/edit">
                        <button> Редактировать тест</button>
                    </Link>
                </div>
                <div className="mt-5 fs-5 ">
                    <p>История прохождений</p>
                    {sortedResults.map(result =>
                        <div key={result.identifier}
                             className="d-flex flex-row justify-content-between border p-3 align-items-center rounded">
                            <div>{result.data.testDate}</div>
                            <div
                                className="d-flex justify-content-center align-items-center w-50">
                                0
                                <div className="progress w-50 ms-3 me-3"
                                     role="progressbar"
                                     aria-label="Basic example" aria-valuenow="0"
                                     aria-valuemin="0"
                                     aria-valuemax={result.data.allQuestions}>
                                    {sum(result) < 30 ? (
                                        <div className="progress-bar bg-danger"
                                             style={{width: `${sum(result)}%`}}> {sum(result)}%
                                        </div>
                                    ) : (
                                        <div className="progress-bar bg-success"
                                             style={{width: `${sum(result)}%`}}> {sum(result)}%
                                        </div>)}
                                </div>
                                {result.data.allQuestions}
                            </div>
                            <div>Верно: {result.data.correctAnswers} из {result.data.allQuestions}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}