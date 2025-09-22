FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia solo il jar compilato
COPY --from=build /app/target/*[!-original].jar app.jar

EXPOSE 8090

# Il CMD è corretto, ma lo specificheremo meglio in Kubernetes
CMD ["java", "-jar", "app.jar"]