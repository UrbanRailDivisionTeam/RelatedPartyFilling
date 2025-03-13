FROM python:3.11-slim
WORKDIR /root
RUN mkdir -p /app && cd /app
COPY . .
RUN pip install --no-cache-dir -r ./requirements.txt
EXPOSE 8000
CMD ["python", "main.py"]