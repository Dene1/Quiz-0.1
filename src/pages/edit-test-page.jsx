import {useCallback, useEffect, useState} from "react"
import {FaRegTrashAlt} from "react-icons/fa";
import {FaChevronUp, FaChevronDown} from "react-icons/fa6";
import {useNavigate} from "react-router"
import {onSave} from "./components/test-completed/components/index.js"
import {v4 as uuidv4} from "uuid";


export const EditTestPage = () => {
    const [openQuestions, setOpenQuestions] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const [quiz, setQuiz] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchQuiz = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000");
                const data = await response.json();
                setQuiz(data[0]);
                const initialOpenQuestions = {};
                if (data[0].questions) {
                    data[0].questions.forEach(question => {
                        initialOpenQuestions[question._id] = false;
                    });
                    setOpenQuestions(initialOpenQuestions);
                }
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            }
        };
        fetchQuiz().finally(() => setIsLoading(false))
    }, [])

    const addAnswer = async (questionId) => {
        const newAnswer = {
            _id: uuidv4(),
            title: "",
            correct: false,
        };

        try {
            const response = await fetch("http://localhost:5000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({questionId, answer: newAnswer}),
            });

            if (!response.ok) {
                throw new Error(`Failed to create answer: ${response.status}`);
            }

            const createdAnswer = await response.json();

            setQuiz(prevQuiz => ({
                ...prevQuiz,
                questions: prevQuiz.questions.map(q =>
                    q._id === questionId
                        ? {
                            ...q,
                            answers: [...q.answers, createdAnswer]
                        }
                        : q
                )
            }));

        } catch (error) {
            console.error("Error adding answer:", error);
        }
    };

    const toggleDropdown = (questionId) => {
        setOpenQuestions(prev => {
            return {
                ...prev,
                [questionId]: !prev[questionId]
            }
        })
    }

    const onQuestionTitleChange = (questionId, event) => {
        const newTitle = event.target.value;
        setQuiz(prevQuiz => {
            return {
                ...prevQuiz,
                questions: prevQuiz.questions.map(question => {
                    if (question.id === questionId) {
                        return {...question, title: newTitle};
                    }
                    return question;
                })
            };
        });
    };

    const onAnswerTitleChange = (questionId, answerId, event) => {
        const newTitle = event.target.value;
        setQuiz(prevQuiz => {
            return {
                ...prevQuiz,
                questions: prevQuiz.questions.map(question => {
                    if (question._id === questionId) {
                        return {
                            ...question,
                            answers: question.answers.map(answer => {
                                if (answer._id === answerId) {
                                    return {...answer, title: newTitle};
                                }
                                return answer;
                            })
                        };
                    }
                    return question;
                })
            };
        });
    };

    const removeAnswer = useCallback(async (questionId, answerId) => { // Добавляем async
        console.log("Deleting answer with ID:", answerId, "from question with ID:", questionId);
        if (window.confirm("Вы уверены, что хотите удалить этот ответ?")) {
            try {
                const response = await fetch(`http://localhost:5000/answers/${answerId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({questionId}),
                });
                if (!response.ok) {
                    throw new Error(`Failed to delete answer: ${response.status}`);
                }
                setQuiz(prevQuiz => ({
                    ...prevQuiz,
                    questions: prevQuiz.questions.map(q =>
                        q._id === questionId
                            ? {
                                ...q,
                                answers: q.answers.filter(a => a._id !== answerId)
                            }
                            : q
                    )
                }));
            } catch (error) {
                console.error("Failed to delete answer:", error);
            }
        }
    }, [setQuiz]);

    const checkVoidAnswer = (e, question, answer) => {
        if (e.target.value.trim() === "") {
            removeAnswer(question, answer)
        }
    }

    const handleCorrectAnswerChange = useCallback((questionId, answerId, event) => {
        const isChecked = event.target.checked;

        setQuiz(prevQuiz => ({
            ...prevQuiz,
            questions: prevQuiz.questions.map(q =>
                q._id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map(answer =>
                            answer._id === answerId
                                ? {...answer, correct: isChecked}
                                : answer
                        )
                    }
                    : q
            )
        }));
    }, [setQuiz]);

    if (isLoading) {
        return (
            <div className="mt-20 d-flex justify-content-center mt-5">
                <div
                    className="d-flex justify-content-center spinner-border text-primary">
                </div>
            </div>
        )
    }

    if (!quiz) {
        return (
            <div>Вопросы не найдены</div>
        )
    }

    return (
        <div className="mt-3 text-center">
            <div className="fs-2">Редактирование теста</div>
            {quiz.questions.map((question, index) => (
                <div className="d-flex flex-row mb-3 w-50 mt-3 mx-auto"
                     key={question._id}>
                    {openQuestions[question._id] ? (
                        <div
                            className="d-flex w-100 flex-column p-3 border rounded mt-1"
                            key={question._id}>
                            <div
                                className="mb-2 100 d-flex flex-row justify-content-between">
                                <input type="text"
                                       value={question.title}
                                       onChange={(event) => onQuestionTitleChange(question.id, event)}
                                       className="form-control w-75"
                                       placeholder="Add Question"/>
                                <FaChevronUp style={{cursor: "pointer"}}
                                             onClick={() => toggleDropdown(question._id)}/>
                            </div>
                            <button onClick={() => addAnswer(question._id)}
                                    className="btn btn-sm border w-25 mt-2 w-25">
                                +
                            </button>
                            {question.answers.map((answer) => (
                                <div className="d-flex flex-row mt-3" key={answer._id}>
                                    <input type="text"
                                           value={answer.title}
                                           placeholder="Add Answer"
                                           onBlur={(e) => checkVoidAnswer(e, question._id, answer._id)}
                                           onChange={(e) => onAnswerTitleChange(question._id, answer._id, e)}
                                           className="d-flex justify-content-between w-75
                                         align-items-center p-2 border rounded mb-2"/>
                                    <div className="ms-2 d-flex flex-column gap-2">
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            checked={answer.correct}
                                            onChange={(e) => handleCorrectAnswerChange(question._id, answer._id, e)}
                                        />
                                        <FaRegTrashAlt className="text-danger"
                                                       style={{cursor: "pointer"}}
                                                       onClick={() => removeAnswer(question._id, answer._id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div onClick={() => toggleDropdown(question._id)}
                             className="d-flex flex-row w-100 justify-content-between p-2 border rounded"
                             style={{cursor: "pointer"}}>
                            Вопрос №{index + 1}. {question.title}
                            <div className=" d-flex justify-content-end">
                                <FaChevronDown style={{cursor: "pointer"}}/>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div
                className="d-flex flex-row gap-3 justify-content-center mx-auto mt-4 fs-5">
                <button onClick={() => navigate(-1)}>
                    Назад
                </button>
                <button className="" onClick={() => onSave(quiz)}>
                    Сохранить
                </button>
            </div>
        </div>
    )
}