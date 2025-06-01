your-repo/
│── index.html          # Homepage
│── about.html          # About page
│── cases.html          # Case submissions
│── articles.html       # Latest articles
│── style.css           # Main styling
│── script.js           # Interactive functions
│── images/             # Folder for medical images
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedCaseShare | Medical Case Discussions</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav>
        <div class="logo">MedCaseShare</div>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="cases.html">Cases</a></li>
            <li><a href="articles.html">Articles</a></li>
            <li><a href="about.html">About</a></li>
        </ul>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
        <h1>Share & Discuss Challenging Medical Cases</h1>
        <p>A platform for medical students and professionals to collaborate.</p>
        <a href="cases.html" class="btn">View Cases</a>
    </header>

    <!-- Features Section -->
    <section class="features">
        <div class="feature-card">
            <h3>Upload Lab Reports</h3>
            <p>Share anonymized patient data for discussion.</p>
        </div>
        <div class="feature-card">
            <h3>Discuss Graphs</h3>
            <p>Analyze ECGs, X-rays, and lab trends.</p>
        </div>
        <div class="feature-card">
            <h3>Latest Research</h3>
            <p>Stay updated with medical journals.</p>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2024 MedCaseShare | Open-Source Medical Education</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
/* General Styles */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    color: #333;
}

nav {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav ul {
    display: flex;
    list-style: none;
}

nav ul li {
    margin-left: 1.5rem;
}

nav a {
    color: white;
    text-decoration: none;
}

.hero {
    background: #3498db;
    color: white;
    text-align: center;
    padding: 4rem 1rem;
}

.btn {
    display: inline-block;
    background: #e74c3c;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
}

.features {
    display: flex;
    justify-content: space-around;
    padding: 2rem;
    flex-wrap: wrap;
}

.feature-card {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 1rem;
    width: 30%;
    margin: 0.5rem;
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}
