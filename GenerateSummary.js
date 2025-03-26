const handleSubmit = async () => {
    if (!text.trim()) {
        alert("Please enter text to summarize.");
        return;
    }

    // If meeting ID is empty, don't send it (backend will generate automatically)
    const finalMeetingId = meetingId.trim() !== "" ? meetingId : null;

    try {
        const response = await fetch("http://localhost:5000/get_summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ text, type: summaryType, meeting_id: finalMeetingId }),
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/summary", {
                state: { summary: data.summary, meeting_id: data.meeting_id }, // Use returned meet_id
            });
        } else {
            alert(data.msg || "Failed to generate summary");
        }
    } catch (error) {
        console.error("Error generating summary:", error);
        alert("An error occurred while generating the summary.");
    }
};
