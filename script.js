/**
 * MedCaseShare - Firebase Integration
 * Handles authentication, case submissions, and case display
 */

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyAEiK7_TLPLr6mOgLD0Sd-ULHO-DC7q9pg",
    authDomain: "medussion.firebaseapp.com",
    databaseURL: "https://medussion-default-rtdb.firebaseio.com",
    projectId: "medussion",
    storageBucket: "medussion.appspot.com",
    messagingSenderId: "734202700211",
    appId: "1:734202700211:web:11065e5e65965b1782abc6"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const elements = {
    caseForm: document.getElementById('caseSubmissionForm'),
    caseList: document.getElementById('casesList') || document.getElementById('recentCases'),
    loadingSpinner: document.querySelector('.loading-spinner'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn')
};

// Utility Functions
const utils = {
    showLoading: (element) => {
        if (element) element.innerHTML = '<div class="loading-spinner"></div>';
    },
    showError: (element, message) => {
        if (element) element.innerHTML = `<p class="error">${message}</p>`;
    },
    formatDate: (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Case Management
const caseManager = {
    // Submit new case
    submitCase: async (caseData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Authentication required");
            
            const caseWithMeta = {
                ...caseData,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                userId: user.uid,
                status: "pending_review"
            };
            
            const newCaseRef = database.ref('cases').push();
            await newCaseRef.set(caseWithMeta);
            return newCaseRef.key;
            
        } catch (error) {
            console.error("Case submission error:", error);
            throw error;
        }
    },

    // Load cases with pagination
    loadCases: async (limit = 10, lastKey = null) => {
        try {
            let query = database.ref('cases').orderByChild('timestamp');
            
            if (lastKey) {
                query = query.endAt(lastKey);
            }
            
            const snapshot = await query.limitToLast(limit).once('value');
            const cases = [];
            
            snapshot.forEach((childSnapshot) => {
                cases.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            return cases.reverse(); // Newest first
        } catch (error) {
            console.error("Error loading cases:", error);
            throw error;
        }
    },

    // Render cases to DOM
    renderCases: (cases, container) => {
        if (!cases.length) {
            container.innerHTML = '<p class="no-cases">No cases found</p>';
            return;
        }

        container.innerHTML = cases.map(caseData => `
            <div class="case-item" data-case-id="${caseData.id}">
                <h3 class="case-title">${caseData.title}</h3>
                <p class="case-preview">${caseData.description.substring(0, 120)}...</p>
                <div class="case-meta">
                    <span class="case-date">${utils.formatDate(caseData.timestamp)}</span>
                    <span class="case-status ${caseData.status}">${caseData.status.replace('_', ' ')}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.case-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = `case-details.html?id=${item.dataset.caseId}`;
            });
        });
    }
};

// Authentication
const authManager = {
    initAuth: async () => {
        try {
            await auth.signInAnonymously();
            console.log("Authenticated anonymously");
            return auth.currentUser;
        } catch (error) {
            console.error("Authentication error:", error);
            throw error;
        }
    }
};

// Form Handling
const formManager = {
    initForm: () => {
        if (!elements.caseForm) return;
        
        elements.caseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Disable button during submission
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner small"></span> Submitting...';
                
                // Get form data
                const caseData = {
                    title: e.target.caseTitle.value.trim(),
                    description: e.target.caseDescription.value.trim()
                };
                
                // Validate
                if (!caseData.title || !caseData.description) {
                    throw new Error("Please fill all required fields");
                }
                
                // Submit
                const caseId = await caseManager.submitCase(caseData);
                
                // Success
                e.target.reset();
                alert(`Case submitted successfully! ID: ${caseId}`);
                
                // Reload cases if on cases page
                if (elements.caseList) {
                    await initPage();
                }
                
            } catch (error) {
                alert(`Submission failed: ${error.message}`);
                console.error("Form error:", error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
};

// Mobile Menu
const mobileMenu = {
    init: () => {
        if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.addEventListener('click', () => {
                document.querySelector('nav ul').classList.toggle('active');
                elements.mobileMenuBtn.classList.toggle('active');
            });
        }
    }
};

// Initialize Page
async function initPage() {
    try {
        // Show loading state
        if (elements.caseList) utils.showLoading(elements.caseList);
        
        // Authenticate
        await authManager.initAuth();
        
        // Load and display cases
        if (elements.caseList) {
            const cases = await caseManager.loadCases();
            caseManager.renderCases(cases, elements.caseList);
        }
        
        // Initialize form
        formManager.initForm();
        
        // Initialize mobile menu
        mobileMenu.init();
        
    } catch (error) {
        console.error("Initialization error:", error);
        if (elements.caseList) {
            utils.showError(elements.caseList, "Failed to load content. Please refresh the page.");
        }
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Export for testing (remove in production)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        caseManager,
        authManager,
        utils
    };
}
