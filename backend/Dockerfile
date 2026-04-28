# 多阶段构建
FROM maven:3.8.6-openjdk-11 AS builder

# 设置工作目录
WORKDIR /app

# 复制Maven配置和源码
COPY pom.xml .
COPY src ./src

# 构建项目
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:11-jre-slim

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 设置环境变量
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# 启动应用
CMD ["java", "-jar", "app.jar"]