pipeline {
  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  containers:
  - name: node
    image: node:latest
    command:
    - cat
    tty: true
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: jenkins-docker-cfg
        mountPath: /kaniko/.docker
  volumes:
  - name: jenkins-docker-cfg
    projected:
      sources:
      - secret:
          name: docker-credentials
          items:
            - key: .dockerconfigjson
              path: config.json
"""
    }
  }

  stages {
    stage('Build Vue.js application') {
      steps {
        git(url:'https://github.com/cloudbees-guru/flow-catalog', credentialsId: 'github-cloudbees-guru')
        container('node') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }
    stage('Build and push Web server image with Kaniko') {
      steps {
        container(name: 'kaniko', shell: '/busybox/sh') {
          withEnv(['PATH+EXTRA=/busybox']) {
            sh '''#!/busybox/sh
                  /kaniko/executor --context `pwd` --destination cloudbeesguru/flow-catalog:1.0.0 
            '''
          }
        }
      }
    }
  }

}