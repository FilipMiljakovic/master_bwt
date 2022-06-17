FROM openjdk:11-jre-slim

ENV SERVER_PORT=5555
EXPOSE 5555

VOLUME /tmp
ADD ./target/bwt-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]
