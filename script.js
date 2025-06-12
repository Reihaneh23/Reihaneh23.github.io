// Form Submission for Cases
document.getElementById("caseSubmissionForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get form values
    const caseTitle = document.getElementById("caseTitle").value;
    const caseDescription = document.getElementById("caseDescription").value;
    
    // Create case data object
    const caseData = {
        title: caseTitle,
        description: caseDescription,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    // Save to Firebase
    database.ref('cases').push(caseData)
        .then(() => {
            alert("Case submitted successfully!");
            this.reset(); // Clear the form
        })
        .catch((error) => {
            alert("Error submitting case: " + error.message);
            console.error("Firebase error:", error);
        });
});
