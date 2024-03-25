# What is this?
This is a simple UI to showcase usability of local LLMs combined with a custom prompt as customer support agents for small and medium sized companies.

Created as part of the [Mittelstand-Digital](https://digitalzentrum-berlin.de/) project at [Hasso-Plattner-Institut](hpi.de)

# How to run

1. Clone the repository
2. Copy the `.env.example` file to `.env` and fill in the required values
3. [run using docker](#run-frontend-using-docker)

## run frontend using docker
```bash
docker compose up
```
in development mode, dependencies arent automatically installed
```bash
docker exec -it ollama-frontend npm install
```

## Ollama server
### run locally
```bash
ollama serve
```

### forward remote server using ssh
```bash
ssh {OLLAMA_HOST} -L 11434:localhost:11434
```
#### Note
Ollama requires a few env variables to be set. Specifcally:
- `OLLAMA_HOST=0.0.0.0:11434`


