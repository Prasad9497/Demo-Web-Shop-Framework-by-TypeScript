pipeline {
    agent any

    parameters {
        choice(
            name: 'TEST_ENV',
            choices: ['stg', 'dev', 'prod'],
            description: 'Environment file used by the Playwright tests.'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run with a visible browser. Usually false on CI agents.'
        )
    }

    options {
        timestamps()
        skipDefaultCheckout(false)
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Install dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Install Chromium') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps chromium'
                    } else {
                        bat 'npx playwright install chromium'
                    }
                }
            }
        }

        stage('Run Playwright tests') {
            steps {
                script {
                    def headedOption = params.HEADED ? ' --headed' : ''
                    def command = "npm run test:${params.TEST_ENV} -- --project=chromium${headedOption}"

                    // Keep the test result as the stage result, then publish artifacts in post.
                    if (isUnix()) {
                        sh command
                    } else {
                        bat command
                    }
                }
            }
        }
    }

    post {
        always {
            // These files remain available from the Jenkins build page after every run.
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**, allure-results/**', allowEmptyArchive: true
            junit testResults: 'test-results/**/*.xml', allowEmptyResults: true
            allure includeProperties: false, results: [[path: 'allure-results']]
        }
        cleanup {
            cleanWs()
        }
    }
}