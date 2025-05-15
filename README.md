# Microservices App - Gestion d'étudiants, sessions, feedbacks et notifications

 architecture :

* Les étudiants (`user-service`)
* Les sessions de cours (`session-service`)
* Les feedbacks d'étudiants (`feedback-service`)
* Les notifications asynchrones (`notification-service`)
* Des statistiques sur les feedbacks (`analytics-service` en gRPC)
* La collecte de logs et dashboards via ELK Stack  (`elk-stack`) avec docker
* Une API Gateway (`api-gateway`)
* docker-compose.yml  (kafka avec docker)
#Structure des services


microservices-app/
├── user-service (REST)
├── session-service (GraphQL)
├── feedback-service (REST + Kafka[producer] + ELK)
├── notification-service (Kafka consumer)
├── analytics-service (gRPC)
├── elk-stack (Logstash + Elasticsearch + Kibana)
├── api-gateway 


#  Fonctionnalités clés

  1. User Service (REST)

* Inscription et listing d'étudiants

  2. Session Service (GraphQL)

* Création et consultation de sessions de cours via GraphQL

  3. Feedback Service (REST)

* Envoi de feedbacks (avec rating/comment)
* Publie vers Kafka(on peut voir le avec kafka ui) + Logstash (pour ELK)

  4. Notification Service

* Ecoute de Kafka, affiche un message de remercimment à chaque feedback reçu

  5. Analytics Service (gRPC)

* `GetFeedbackStats(studentId)` : nb de feedbacks envoyés par student
* `GetSessionStats(sessionId)` : nb de feedbacks sur une session

  6. API Gateway

* Point d'entrée unique

  7. ELK Stack (Logstash + Elasticsearch + Kibana)

* Visualisation des feedbacks
* Dashboard dans Kibana


# Kibana Dashboard

* Accessible via [http://localhost:5601](http://localhost:5601)
* Index : `feedbacks-index`


