# Use official Python slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y build-essential

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port 8000 for Daphne
EXPOSE 8000

RUN ["python3", "manage.py", "makemigrations"]
RUN ["python3", "manage.py", "migrate"]
RUN ["python3", "manage.py", "collectstatic", "--noinput"]

# Default command to run Daphne server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "chatserver.asgi:application"]

