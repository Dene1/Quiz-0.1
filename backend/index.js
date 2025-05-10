const express = require("express")
const mongoose = require("mongoose")
const test = require("./models/quiz")
const cors = require("cors")

const {getQuiz} = require("./quiz.controller")

const port = 5000
const app = express()

app.set("view engine", "ejs")
app.set("views", "pages")

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.get("/", async (req, res) => {
    const quizzes = await getQuiz()
    setTimeout(() => {
        res.json(quizzes)
    }, 1000)
})

app.post("/", async (req, res) => {
        try {
            const { questionId, answer } = req.body

            const quiz = await test.findOne({ "questions._id": questionId });

            if (!quiz) {
                return res.status(404).json({ message: "Question not found" });
            }

            const question = quiz.questions.find(q => q._id.toString() === questionId)

            if (!question) {
                return res.status(404).json({ message: "Question not found" })
            }

            // Создаем новый ответ (может понадобиться дополнительная обработка)
            const newAnswer = {
                _id: new mongoose.Types.ObjectId(),
                title: answer.title,
                correct: answer.correct
            }

            question.answers.push(newAnswer);
            await quiz.save();

            res.status(201).json(newAnswer)
        } catch (e) {
            console.log(e)
        }
    }
)

app.put("/", async (req, res) => {
    try {
        const updatedQuiz = req.body
        let quiz

        quiz = await test.findOneAndUpdate({_id: updatedQuiz._id}, updatedQuiz, {new: true})
        if (!quiz) {
            return res.status(404).json({message: "Quiz not found"});
        }
        res.json(quiz)
    } catch (error) {
        console.error("Failed to update quiz:", error)
        res.status(500).json({message: "Failed to update quiz", error: error.message})
    }
})

app.delete("/answers/:answerId", async (req, res) => {
    try {
        const {answerId} = req.params
        const {questionId} = req.body

        const quiz = await test.findOne({"questions._id": questionId})

        if (!quiz) {
            return res.status(404).json({message: "Quiz not found"})
        }

        const question = quiz.questions.find(q => q._id.toString() === questionId)

        if (!question) {
            return res.status(404).json({message: "Question not found"})
        }

        question.answers.pull({_id: answerId})
        await quiz.save()

        res.json({message: "Answer deleted successfully"})

    } catch (error) {
        console.error("Failed to delete answer:", error)
        res.status(500).json({message: "Failed to delete answer", error: error.message})
    }
});


mongoose.connect("mongodb+srv://user:quizpass@cluster0.wahyops.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
    .then(async () => {
        app.listen(port, "0.0.0.0", () => console.log(`Server has been started on ${port} port`))
    })