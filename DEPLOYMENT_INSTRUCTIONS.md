# Deployment Instructions for trasigmenhel.se

Follow these steps to deploy your website to GitHub Pages with your custom domain.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in (or create an account if you don't have one)
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository `trasigmenhel.se` (or any name you prefer)
4. Make the repository public
5. Click "Create repository"

## Step 2: Initialize Git and Push Your Code

Run these commands in your project directory (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Initialize Git repository
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial commit"

# Add the GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/trasigmenhel.se.git

# Push to GitHub
git push -u origin main
```

Note: If your default branch is called `master` instead of `main`, use `master` in the commands above.

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "gh-pages" branch
5. Under "Custom domain", enter `trasigmenhel.se`
6. Check the "Enforce HTTPS" option (recommended)
7. Click "Save"

## Step 4: Configure DNS Settings

At your domain registrar (where you purchased trasigmenhel.se), set up the following DNS records:

### Option 1: A Records (Recommended)
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

### Option 2: CNAME Record
```
CNAME    www    YOUR_USERNAME.github.io
```

## Step 5: Deploy Your Website

Run this command to deploy your website:

```bash
npm run deploy
```

This will build your project and push it to the `gh-pages` branch of your repository.

## Step 6: Verify Zoho

After your website is deployed, go back to Zoho and complete the verification process by clicking the "Verify" button.

## Troubleshooting

- It may take up to 24 hours for DNS changes to propagate
- If you see a 404 error, make sure your repository is public and GitHub Pages is enabled
- If your custom domain isn't working, check your DNS settings and make sure the CNAME file is in the root of your project

## Future Deployments

Whenever you make changes to your website, simply run:

```bash
npm run deploy
```

This will build your project and update the deployed website.
