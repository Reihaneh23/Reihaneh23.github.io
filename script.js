// Wait for everything AND Firebase to be ready
function whenFirebaseReady() {
    return new Promise((resolve) => {
        if (window.firebaseReady) return resolve();
        
        const checkInterval = setInterval(() => {
            if (window.firebaseReady) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

async function initApp() {
    try {
        // 1. Wait for Firebase
        await whenFirebaseReady();
        if (typeof firebase === 'undefined') throw new Error("Firebase still not loaded");

        // 2. Authenticate
        const auth = firebase.auth();
        await auth.signInAnonymously();
        console.log("🔑 Authenticated as:", auth.currentUser.uid);

        // 3. Setup form handler
        document.getElementById('caseSubmissionForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const form = e.target;
            const btn = form.querySelector('button[type="submit"]');
            
            try {
                btn.disabled = true;
                
                // Get form data
                const caseData = {
                    title: form.caseTitle.value.trim(),
                    description: form.caseDescription.value.trim(),
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    userId: auth.currentUser.uid
                };

                // Validate
                if (!caseData.title || !caseData.description) {
                    throw new Error("Please fill all fields");
                }

                // Submit
                const dbRef = firebase.database().ref('cases');
                const newCase = await dbRef.push(caseData);
                alert(`✅ Case #${newCase.key.substr(0, 5)} saved!`);
                form.reset();
                
            } catch (error) {
                console.error("Submission error:", error);
                alert(`❌ Error: ${error.message}`);
            } finally {
                btn.disabled = false;
            }
        });

    } catch (error) {
        console.error("Initialization failed:", error);
        alert("System error - please refresh the page");
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);
