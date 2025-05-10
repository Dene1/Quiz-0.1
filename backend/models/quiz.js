const mongoose = require("mongoose")

const NoteSchema = mongoose.Schema({
    questions: [
        {
            title: String,
            answers: [
                {
                    title: String,
                    correct: Boolean,
                },
            ],
        }
    ]
})

const quiz = mongoose.model("test", NoteSchema, "quiz")

module.exports = quiz