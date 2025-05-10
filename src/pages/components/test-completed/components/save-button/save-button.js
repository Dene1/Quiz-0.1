export const onSave = async (quiz) => {
    try {
        const response = await fetch("http://localhost:5000", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(quiz),
        });
        if (response.ok) {
            console.log("Quiz saved successfully!");
        } else {
            console.error("Failed to save quiz:", response.status);
        }
    } catch (error) {
        console.error("Error saving quiz:", error);
    }
};