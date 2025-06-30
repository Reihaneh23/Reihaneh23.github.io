// Wait for everything to load
window.addEventListener('DOMContentLoaded', async () => {
    // Verify Firebase is available
    if (typeof firebase === 'undefined') {
        console.error("Firebase not loaded!");
        alert("System error - please refresh the page");
        return;
    }

    // Initialize authentication
    try {
        await firebase.auth().signInAnonymously();
        console.log("Authenticated successfully");
    } catch (authError) {
        console.error("Auth failed:", authError);
        alert("Couldn't connect to server. Please try again.");
        return;
    }

    // Handle form submission
    const form = document.getElementById('caseSubmissionForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('caseTitle').value.trim();
        const description = document.getElementById('caseDescription').value.trim();

        // Validate
        if (!title || !description) {
            alert("Please fill in all fields");
            return;
        }

        // Prepare data
        const caseData = {
            title: title,
            description: description,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userId: firebase.auth().currentUser.uid
        };

        // Submit to Firebase
        try {
            const newCaseRef = firebase.database().ref('cases').push();
            await newCaseRef.set(caseData);
            alert(`Case #${newCaseRef.key.substr(0, 6)} submitted!`);
            form.reset();
        } catch (dbError) {
            console.error("Database error:", dbError);
            alert("Failed to save case. Please check your connection.");
        }
    });
});
