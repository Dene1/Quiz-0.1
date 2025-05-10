const test = require("./models/quiz")

// async function addNote(title) {
//     await note.create({title})
//
//     console.log("Note was added")
// }

async function getQuiz() {
    const quiz = await test.find()
    return quiz
}

module.exports = {
    getQuiz
}