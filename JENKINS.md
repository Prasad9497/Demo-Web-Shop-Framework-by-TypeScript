# Jenkins CI/CD Setup

## Jenkins prerequisites

Install these Jenkins plugins:

- Pipeline
- Git
- JUnit
- HTML Publisher
- Allure Jenkins Plugin
- Workspace Cleanup Plugin

The Jenkins agent must have Node.js and npm available on its PATH. The pipeline installs the project dependencies and Chromium itself.

## Create the Jenkins job

1. Create a **Pipeline** job.
2. In **Pipeline > Definition**, select **Pipeline script from SCM**.
3. Select **Git** and enter:

   `https://github.com/Prasad9497/Demo-Web-Shop-Framework-by-TypeScript.git`

4. Set the branch to `*/main`.
5. Set the script path to `Jenkinsfile`.
6. Save and select **Build with Parameters**.

## Parameters

- `TEST_ENV`: selects `.env.dev`, `.env.stg`, or `.env.prod`.
- `HEADED`: use `false` for normal CI. Use `true` only when the Jenkins agent has a desktop session.

## What the pipeline does

1. Runs `npm ci` using the committed lock file.
2. Installs the Chromium browser required by Playwright.
3. Runs the selected environment command, for example:

   `npm run test:stg -- --project=chromium`

4. Archives Playwright screenshots, videos, traces, HTML reports, and Allure result files.
5. Publishes JUnit and Allure results when the corresponding Jenkins plugins are configured.

## GitHub webhook

For automatic builds, configure a GitHub webhook pointing to:

`https://YOUR-JENKINS-URL/github-webhook/`

Enable the GitHub hook trigger in the Jenkins job. Do not put GitHub tokens in this file; store them in Jenkins Credentials and use them in the SCM configuration.